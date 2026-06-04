
import { getPageSeoMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { PageSet } from "./PageSet";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoMetadata('page_contact');
  
  return seo;
}

const ContactPage = () => (
  <PageSet />
);


export default ContactPage;