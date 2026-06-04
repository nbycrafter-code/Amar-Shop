'use client'
import Link from "next/link";
import { SimplePage } from "../components/SimplePage";
import { useLanguage } from "@/context/LanguageContext";

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


export const PageSet = () => {
  const { language } = useLanguage();

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

  const pageTitle = language === 'bn' ? 'ব্লগ' : 'Blog';

  return (
    <SimplePage title={pageTitle}>
      {blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={language === 'bn' ? post.title.bn : post.title.en}
                  className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#ef553f] font-medium">
                  {language === 'bn' ? post.date.bn : post.date.en}
                </p>
                <h3 className="text-lg font-semibold mt-2 text-gray-800 hover:text-[#ef553f] transition-colors duration-300 line-clamp-2">
                  <Link href={`/blog/${post.id}`} className="block">
                    {language === 'bn' ? post.title.bn : post.title.en}
                  </Link>
                </h3>
                <button className="mt-3 text-sm text-[#ef553f] hover:text-[#d4382c] font-medium transition-colors">
                  {language === 'bn' ? 'আরও পড়ুন →' : 'Read More →'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {language === 'bn' ? 'কোন ব্লগ পোস্ট পাওয়া যায়নি।' : 'No blog posts found.'}
          </p>
        </div>
      )}
    </SimplePage>
  );
};