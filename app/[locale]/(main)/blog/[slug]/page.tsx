import { getBlogSeoMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { PageSet } from "./PageSet";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // TODO: আপনার API থেকে ব্লগ ডাটা fetch করুন
  const blog = {
    _id: 1,
    title: {
      en: "How to Write a Blog Post Your Readers Will Love",
      bn: "কিভাবে একটি ব্লগ পোস্ট লিখবেন যা আপনার পাঠকরা পছন্দ করবে"
    },
    date: {
      en: "February 9, 2026",
      bn: "৯ ফেব্রুয়ারি, ২০২৬"
    },
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop",
    content: {
      en: "Blog content in English...",
      bn: "বাংলায় ব্লগ কন্টেন্ট..."
    },
    excerpt: {
      en: "Blog excerpt in English...",
      bn: "বাংলায় ব্লগ এক্সার্প্ট..."
    }
  };
  
  const seo = await getBlogSeoMetadata(blog._id, blog);
  
  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  };
}

const BlogDetailsPage = async () => {
  // TODO: আপনার API থেকে ব্লগ ডাটা fetch করুন
  const blog = {
    _id: 1,
    title: {
      en: "How to Write a Blog Post Your Readers Will Love",
      bn: "কিভাবে একটি ব্লগ পোস্ট লিখবেন যা আপনার পাঠকরা পছন্দ করবে"
    },
    date: {
      en: "February 9, 2026",
      bn: "৯ ফেব্রুয়ারি, ২০২৬"
    },
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop",
    content: {
      en: `<p>Writing a blog post that resonates with your readers requires careful planning and execution. Here are some key tips:</p>
            <ul>
              <li>Know your audience</li>
              <li>Create compelling headlines</li>
              <li>Use engaging visuals</li>
              <li>Optimize for SEO</li>
              <li>Include a clear call-to-action</li>
            </ul>
            <p>Remember to always provide value to your readers and keep them coming back for more!</p>`,
      bn: `<p>আপনার পাঠকদের সাথে সংযোগ স্থাপন করে এমন একটি ব্লগ পোস্ট লেখার জন্য সতর্ক পরিকল্পনা এবং কার্যকরী পদক্ষেপ প্রয়োজন। এখানে কিছু গুরুত্বপূর্ণ টিপস দেওয়া হল:</p>
            <ul>
              <li>আপনার দর্শকদের জানুন</li>
              <li>আকর্ষণীয় শিরোনাম তৈরি করুন</li>
              <li>আকর্ষণীয় ভিজ্যুয়াল ব্যবহার করুন</li>
              <li>SEO এর জন্য অপ্টিমাইজ করুন</li>
              <li>একটি স্পষ্ট কল-টু-অ্যাকশন অন্তর্ভুক্ত করুন</li>
            </ul>
            <p>সর্বদা আপনার পাঠকদের মূল্য প্রদান করতে মনে রাখবেন এবং তাদের আরও জন্য ফিরিয়ে আনুন!</p>`
    },
    excerpt: {
      en: "Discover the essential tips and tricks for writing engaging blog posts that your readers will love...",
      bn: "আকর্ষণীয় ব্লগ পোস্ট লেখার জন্য প্রয়োজনীয় টিপস এবং কৌশলগুলি আবিষ্কার করুন যা আপনার পাঠকরা পছন্দ করবে..."
    },
    author: {
      en: "Admin",
      bn: "প্রশাসক"
    },
    category: {
      en: "Blogging",
      bn: "ব্লগিং"
    },
    tags: {
      en: ["blogging", "content writing", "marketing"],
      bn: ["ব্লগিং", "কন্টেন্ট রাইটিং", "মার্কেটিং"]
    }
  };

  return (
    <PageSet blog={blog} />
  );
}

export default BlogDetailsPage;