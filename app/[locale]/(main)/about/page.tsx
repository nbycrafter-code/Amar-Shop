// app/(main)/bn/about/page.tsx
import { getPageSeoMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { PageSet } from "./PageSet";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoMetadata('page_about');
  return seo;
}

const AboutPage = async () => {
  return <PageSet />;
};

export default AboutPage;