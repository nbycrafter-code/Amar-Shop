// queries/page-content.ts
import { PageContent } from "@/model/page-content-model";
import { connectDB } from "@/lib/db";

export interface PageContentType {
  _id?: string;
  pageType: "about" | "contact" | "privacy" | "terms" | "faq";
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  metaTitle: string;
  metaTitleBn: string;
  metaDescription: string;
  metaDescriptionBn: string;
  metaKeywords: string;
  metaKeywordsBn: string;
  email?: string;
  phone?: string;
  address?: string;
  addressBn?: string;
  googleMapUrl?: string;
  workingHours?: string;
  workingHoursBn?: string;
  mission?: string;
  missionBn?: string;
  vision?: string;
  visionBn?: string;
  history?: string;
  historyBn?: string;
  bannerImage?: string;
  aboutImage?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  schemaMarkup?: string;
  canonicalUrl?: string;
  active: boolean;
}

// Get page content by type
export async function getPageContent(pageType: string): Promise<PageContentType | null> {
  try {
    await connectDB();
    const content = await PageContent.findOne({ pageType, active: true }).lean();
    return content as PageContentType;
  } catch (error) {
    console.error(`Error fetching ${pageType} page content:`, error);
    return null;
  }
}

// Get all page contents (for admin)
export async function getAllPageContents(): Promise<PageContentType[]> {
  try {
    await connectDB();
    const contents = await PageContent.find({}).sort({ pageType: 1 }).lean();
    return contents as PageContentType[];
  } catch (error) {
    console.error("Error fetching all page contents:", error);
    return [];
  }
}

// Create or update page content
export async function upsertPageContent(
  pageType: string,
  data: Partial<PageContentType>
): Promise<PageContentType | null> {
  try {
    await connectDB();
    const content = await PageContent.findOneAndUpdate(
      { pageType },
      { $set: { ...data, updated_at: new Date() } },
      { new: true, upsert: true }
    ).lean();
    return content as PageContentType;
  } catch (error) {
    console.error("Error upserting page content:", error);
    return null;
  }
}

// Delete page content
export async function deletePageContent(id: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await PageContent.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error("Error deleting page content:", error);
    return false;
  }
}