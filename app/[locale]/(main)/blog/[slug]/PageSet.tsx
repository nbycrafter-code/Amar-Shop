'use client'
import { SimplePage } from "../../components/SimplePage";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, User, Folder, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  _id?: number;
  title?: {
    en: string;
    bn: string;
  };
  date?: {
    en: string;
    bn: string;
  };
  image?: string;
  content?: {
    en: string;
    bn: string;
  };
  author?: {
    en: string;
    bn: string;
  };
  category?: {
    en: string;
    bn: string;
  };
  tags?: {
    en: string[];
    bn: string[];
  };
}

interface PageSetProps {
  blog?: BlogPost;
}

export const PageSet = ({ blog }: PageSetProps) => {
  const { language } = useLanguage();

  // যদি ব্লগ ডাটা না থাকে তাহলে ডিফল্ট কন্টেন্ট
  if (!blog) {
    const defaultContent = {
      title: language === 'bn' ? 'ব্লগ বিস্তারিত' : 'Blog Details',
      description: language === 'bn' 
        ? 'মেগাশপ একটি আধুনিক মাল্টি-ক্যাটাগরি ই-কমার্স স্টোর যা বিশ্বস্ত পণ্যের উপর দৃষ্টি নিবদ্ধ করে।'
        : 'MegaShop is a modern multi-category e-commerce store focused on trusted products.'
    };

    return (
      <SimplePage title={defaultContent.title}>
        <p className="text-gray-700">{defaultContent.description}</p>
      </SimplePage>
    );
  }

  // ল্যাঙ্গুয়েজ অনুযায়ী কন্টেন্ট
  const getTitle = (): string => {
    if (language === 'bn') {
      return blog.title?.bn || 'ব্লগ বিস্তারিত';
    }
    return blog.title?.en || 'Blog Details';
  };

  const getDate = (): string | undefined => {
    return language === 'bn' ? blog.date?.bn : blog.date?.en;
  };

  const getContent = (): string | undefined => {
    return language === 'bn' ? blog.content?.bn : blog.content?.en;
  };

  const getAuthor = (): string | undefined => {
    return language === 'bn' ? blog.author?.bn : blog.author?.en;
  };

  const getCategory = (): string | undefined => {
    return language === 'bn' ? blog.category?.bn : blog.category?.en;
  };

  const getTags = (): string[] | undefined => {
    return language === 'bn' ? blog.tags?.bn : blog.tags?.en;
  };

  const backText = language === 'bn' ? 'ব্লগে ফিরুন' : 'Back to Blog';
  const tagsLabel = language === 'bn' ? 'ট্যাগস:' : 'Tags:';

  return (
    <SimplePage title={getTitle()}>
      {/* Back Button */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-[#ef553f] hover:text-[#d4382c] mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        {backText}
      </Link>

      {/* Featured Image */}
      {blog.image && (
        <div className="rounded-lg overflow-hidden mb-8">
          <img 
            src={blog.image} 
            alt={getTitle()}
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Blog Meta Info */}
      {(getDate() || getAuthor() || getCategory()) && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
          {getDate() && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#ef553f]" />
              <span>{getDate()}</span>
            </div>
          )}
          {getAuthor() && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#ef553f]" />
              <span>{getAuthor()}</span>
            </div>
          )}
          {getCategory() && (
            <div className="flex items-center gap-2">
              <Folder size={16} className="text-[#ef553f]" />
              <span>{getCategory()}</span>
            </div>
          )}
        </div>
      )}

      {/* Blog Content */}
      {getContent() && (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-li:text-gray-600 prose-a:text-[#ef553f] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: getContent() }}
        />
      )}

      {/* Tags */}
      {getTags() && getTags().length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-[#ef553f]" />
            <span className="font-medium text-gray-700 mr-2">{tagsLabel}</span>
            {getTags().map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-[#ef553f] hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </SimplePage>
  );
};