
import { getPageSeoMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { PageSet } from "./PageSet";

interface BlogPost {
  id: number;
  title: {
    en: string;
    bn: string;
  };
  date: {
    en: string;
    bn: string;
  };
  image: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoMetadata('blogs');
  return seo;
}

const BlogPage = () => {

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: {
        en: "How to Write a Blog Post Your Readers Will Love",
        bn: "কিভাবে একটি ব্লগ পোস্ট লিখবেন যা আপনার পাঠকরা পছন্দ করবে"
      },
      date: {
        en: "February 9, 2026",
        bn: "৯ ফেব্রুয়ারি, ২০২৬"
      },
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      title: {
        en: "9 Content Marketing Trends and Ideas to Increase Traffic",
        bn: "ট্রাফিক বাড়ানোর জন্য ৯টি কন্টেন্ট মার্কেটিং ট্রেন্ড ও আইডিয়া"
      },
      date: {
        en: "February 7, 2026",
        bn: "৭ ফেব্রুয়ারি, ২০২৬"
      },
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop",
    },
    {
      id: 3,
      title: {
        en: "The Ultimate Guide to Marketing Strategies",
        bn: "মার্কেটিং স্ট্র্যাটেজির আলটিমেট গাইড"
      },
      date: {
        en: "February 5, 2026",
        bn: "৫ ফেব্রুয়ারি, ২০২৬"
      },
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <PageSet blogPosts={blogPosts} />
  );
};

export default BlogPage;