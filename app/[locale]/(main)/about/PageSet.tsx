// app/(main)/bn/about/PageSet.tsx
'use client'
import { SimplePage } from "@/app/[locale]/(main)/components/SimplePage";
import { useLanguage } from "@/context/LanguageContext";

export const PageSet = () => {
  const { language } = useLanguage();

  const content = {
    title: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us',
    description: language === 'bn' 
      ? 'মেগাশপ একটি আধুনিক মাল্টি-ক্যাটাগরি ই-কমার্স স্টোর যা বিশ্বস্ত পণ্যের উপর দৃষ্টি নিবদ্ধ করে।'
      : 'MegaShop is a modern multi-category e-commerce store focused on trusted products.',
    mission: language === 'bn'
      ? 'আমাদের লক্ষ্য是最好的 পণ্য সেরা দামে পৌঁছে দেওয়া'
      : 'Our mission is to deliver the best products at the best prices',
    vision: language === 'bn'
      ? 'আমরা একটি বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম হতে চাই'
      : 'We aim to be the most trusted online shopping platform'
  };

  return (
    <SimplePage title={content.title}>
      <div className="space-y-6">
        <p className="text-gray-700">{content.description}</p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
            </h3>
            <p className="text-gray-600">{content.mission}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision'}
            </h3>
            <p className="text-gray-600">{content.vision}</p>
          </div>
        </div>
      </div>
    </SimplePage>
  );
};