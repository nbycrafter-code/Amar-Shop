'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ল্যাঙ্গুয়েজ অনুযায়ী ট্যাব নাম
const getTabs = (isBn: boolean) => {
  if (isBn) {
    return ['বিবরণ', 'অতিরিক্ত তথ্য', 'রিভিউ', 'সাইজ চার্ট', 'শিপিং ও রিটার্ন', 'প্রশ্নোত্তর'];
  }
  return ['Description', 'Additional info', 'Reviews', 'Size Chart', 'Shipping & Return', 'FAQ'];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          size={13} 
          className={i < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-gray-200'} 
        />
      ))}
    </div>
  );
}

// FAQ আইটেম কম্পোনেন্ট
function FAQItem({ question, answer, isBn }: { question: string; answer: string; isBn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-2 text-left hover:bg-gray-50 transition-colors"
        type="button"
      >
        <span className="font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-orange-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function ProductTabs() {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  
  // ✅ useMemo দিয়ে tabs মেমোয়াজ করুন
  const tabs = useMemo(() => getTabs(isBn), [isBn]);
  
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  // ✅ ভাষা পরিবর্তন হলে activeTab আপডেট করুন
  useEffect(() => {
    setActiveTab(tabs[0]);
  }, [tabs]);

  // ✅ ট্যাব ক্লিক হ্যান্ডলার
  const handleTabClick = useCallback((tab: string) => {
    console.log('Tab clicked:', tab);
    setActiveTab(tab);
  }, []);

  const reviewCount = 2;
  
  const getTabDisplayName = (tab: string) => {
    if ((tab === 'Reviews' || tab === 'রিভিউ') && reviewCount > 0) {
      return `${tab} (${reviewCount})`;
    }
    return tab;
  };

  // FAQ ডেটা
  const faqData = isBn ? [
    {
      question: 'এই পণ্যটি কি অরিজিনাল?',
      answer: 'হ্যাঁ, আমরা ১০০% অরিজিনাল প্রোডাক্ট সরবরাহ করি। প্রতিটি পণ্যের সাথে অথেন্টিসিটি সার্টিফিকেট দেওয়া হয়।'
    },
    {
      question: 'কত দিনের মধ্যে ডেলিভারি পাব?',
      answer: 'ঢাকার ভিতরে ১-২ দিন এবং ঢাকার বাইরে ৩-৫ দিনের মধ্যে ডেলিভারি দেওয়া হয়।'
    },
    {
      question: 'প্রোডাক্ট ফেরত দেওয়ার নীতি কী?',
      answer: 'পণ্য ডেলিভারির ৩০ দিনের মধ্যে যেকোনো সমস্যায় ফেরত দেওয়া যায়। পণ্যের ট্যাগ এবং প্যাকিং অক্ষত থাকতে হবে।'
    },
    {
      question: 'ক্যাশ অন ডেলিভারি সুবিধা আছে?',
      answer: 'হ্যাঁ, সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ।'
    },
    {
      question: 'সাইজ পরিবর্তন করা যাবে?',
      answer: 'হ্যাঁ, পণ্য ডেলিভারির ৭ দিনের মধ্যে সাইজ পরিবর্তন করা যায়।'
    }
  ] : [
    {
      question: 'Is this product original?',
      answer: 'Yes, we provide 100% original products. Each product comes with an authenticity certificate.'
    },
    {
      question: 'When will I get delivery?',
      answer: 'Delivery within 1-2 days in Dhaka and 3-5 days outside Dhaka.'
    },
    {
      question: 'What is the return policy?',
      answer: 'You can return any product within 30 days of delivery if there is any issue. Product tags and packaging must be intact.'
    },
    {
      question: 'Is Cash on Delivery available?',
      answer: 'Yes, Cash on Delivery is available all over Bangladesh.'
    },
    {
      question: 'Can I exchange the size?',
      answer: 'Yes, you can exchange the size within 7 days of delivery.'
    }
  ];

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Tab nav */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            type="button"
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-300 hover:bg-gray-100'
            }`}
          >
            {getTabDisplayName(tab)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {/* Tab 0: Description */}
        {activeTab === tabs[0] && (
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="mb-3">
              {isBn 
                ? 'আসবাবপত্র বলতে এমন বস্তুকে বোঝায় যা বিভিন্ন মানবিক কাজ যেমন বসা (যেমন স্টুল, চেয়ার এবং সোফা), খাওয়া (টেবিল), জিনিসপত্র সংরক্ষণ, কাজ করা এবং ঘুমানো (যেমন বিছানা এবং হ্যামক) সমর্থন করার জন্য ডিজাইন করা হয়েছে। আসবাবপত্র কাজের জন্য সুবিধাজনক উচ্চতায় বস্তু ধারণ করতেও ব্যবহৃত হয় (মাটির উপরে অনুভূমিক পৃষ্ঠ হিসাবে, যেমন টেবিল এবং ডেস্ক), বা জিনিস সংরক্ষণ করতে (যেমন আলমারি, শেল্ফ এবং ড্রয়ার)। আসবাবপত্র নকশার একটি পণ্য হতে পারে এবং এটিকে আলংকারিক শিল্পের একটি রূপ হিসাবে বিবেচনা করা যেতে পারে। আসবাবপত্রের কার্যকরী ভূমিকা ছাড়াও, এটি একটি প্রতীকী বা ধর্মীয় উদ্দেশ্যেও কাজ করতে পারে। এটি ধাতু, প্লাস্টিক এবং কাঠ সহ বিভিন্ন ধরণের উপকরণ থেকে তৈরি করা যেতে পারে। আসবাবপত্র বিভিন্ন ধরনের কাঠের জয়েন্ট ব্যবহার করে তৈরি করা যেতে পারে যা প্রায়শই স্থানীয় সংস্কৃতিকে প্রতিফলিত করে।'
                : 'Furniture refers to objects intended to support various human activities such as seating (e.g., stools, chairs, and sofas), eating (tables), storing items, working, and sleeping (e.g., beds and hammocks). Furniture is also used to hold objects at a convenient height for work (as horizontal surfaces above the ground, such as tables and desks), or to store things (e.g., cupboards, shelves, and drawers). Furniture can be a product of design and can be considered a form of decorative art. In addition to furniture\'s functional role, it can serve a symbolic or religious purpose. It can be made from a vast multitude of materials, including metal, plastic, and wood. Furniture can be made using a variety of woodworking joints which often reflects the local culture.'}
            </p>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                {isBn ? 'সাইজ ও ফিট:' : 'Size & fit:'}
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  {isBn 
                    ? 'ওভারসাইজড, ড্রপড শোল্ডার, বেলো সীট লেন্থ।'
                    : 'Oversized, Dropped shoulder, Below seat length.'}
                </li>
                <li>
                  {isBn 
                    ? 'আপনি যদি ছোট ফিট পছন্দ করেন তবে সাইজ কমিয়ে নিন। মডেলের উচ্চতা ১৭৬ সেমি এবং তিনি S/36 সাইজ পরেছেন। সাইজ গাইড দেখুন'
                    : 'Size down if you prefer a smaller fit. The model is 176 cm and is wearing a size S/36. View size guide'}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 1: Additional information */}
        {activeTab === tabs[1] && (
          <div className="text-sm text-gray-600">
            <table className="w-full border-collapse">
              <tbody>
                {[
                  [isBn ? 'রঙ' : 'Color', isBn ? 'গাঢ় টাউপ, নেভি, কালো' : 'Dark Taupe, Navy, Black'],
                  [isBn ? 'সাইজ' : 'Size', 'L, M, S, XL, XS'],
                  [isBn ? 'মেটেরিয়াল' : 'Material', isBn ? '১০০% উল' : '100% Wool'],
                  [isBn ? 'স্টাইল' : 'Style', isBn ? 'ওভারসাইজড, র‍্যাপ' : 'Oversized, Wrap'],
                  [isBn ? 'ব্র্যান্ড' : 'Brand', 'Calvin Klein'],
                  [isBn ? 'যত্ন' : 'Care', isBn ? 'শুধু ড্রাই ক্লিন' : 'Dry Clean Only'],
                ].map(([key, val]) => (
                  <tr key={key as string} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-700 w-40">{key as string}</td>
                    <td className="py-2 text-gray-600">{val as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === tabs[2] && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-base">
              {isBn ? 'গ্রাহক রিভিউ' : 'Customer Reviews'} ({reviewCount})
            </h3>
            {[
              { 
                name: isBn ? 'সারা এম.' : 'Sarah M.', 
                rating: 5, 
                date: isBn ? '১২ মার্চ, ২০২৪' : 'March 12, 2024', 
                comment: isBn 
                  ? 'এই কোটটি খুবই ভালো লাগে! কোয়ালিটি অসাধারণ এবং ফিট পারফেক্ট। প্রতিটি পয়সা মূল্যবান।'
                  : 'Absolutely love this coat! The quality is exceptional and the fit is perfect. Worth every penny.' 
              },
              { 
                name: isBn ? 'জেমস কে.' : 'James K.', 
                rating: 4, 
                date: isBn ? '২৮ ফেব্রুয়ারি, ২০২৪' : 'February 28, 2024', 
                comment: isBn
                  ? 'দারুণ কোট, খুব গরম এবং স্টাইলিশ। রঙ ঠিক যেমন দেখানো হয়েছে। একমাত্র ছোট সমস্যা হল বেল্টটি একটু লম্বা হতে পারে।'
                  : 'Great coat, very warm and stylish. The color is exactly as shown. Only minor issue is the belt could be a bit longer.' 
              },
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-gray-600 pl-11">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Size Chart */}
        {activeTab === tabs[3] && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    isBn ? 'সাইজ' : 'Size', 
                    isBn ? 'বুক (ইঞ্চি)' : 'Chest (in)', 
                    isBn ? 'কোমর (ইঞ্চি)' : 'Waist (in)', 
                    isBn ? 'হিপ (ইঞ্চি)' : 'Hip (in)', 
                    isBn ? 'লেন্থ (ইঞ্চি)' : 'Length (in)'
                  ].map((h, i) => (
                    <th key={i} className="border border-gray-200 px-4 py-2 text-gray-700 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '31-32', '24-25', '34-35', '44'],
                  ['S', '33-34', '26-27', '36-37', '45'],
                  ['M', '35-37', '28-30', '38-40', '46'],
                  ['L', '38-40', '31-33', '41-43', '47'],
                  ['XL', '41-43', '34-36', '44-46', '48'],
                ].map((size, index) => (
                  <tr key={index} className="hover:bg-orange-50 transition-colors">
                    <td className="border border-gray-200 px-4 py-2 font-semibold text-orange-500">{size[0]}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600 text-center">{size[1]}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600 text-center">{size[2]}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600 text-center">{size[3]}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600 text-center">{size[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Shipping & Return */}
        {activeTab === tabs[4] && (
          <div className="text-sm text-gray-600 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                {isBn ? 'শিপিং নীতি' : 'Shipping Policy'}
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isBn ? '$২০০ এর উপরে অর্ডারে ফ্রি স্ট্যান্ডার্ড শিপিং' : 'Free standard shipping on orders over $200'}</li>
                <li>{isBn ? 'স্ট্যান্ডার্ড শিপিং: ৪-৭ কার্যদিবস' : 'Standard shipping: 4-7 business days'}</li>
                <li>{isBn ? 'এক্সপ্রেস শিপিং: ১-২ কার্যদিবস (অতিরিক্ত ফি)' : 'Express shipping: 1-2 business days (additional fee)'}</li>
                <li>{isBn ? 'নির্বাচিত দেশে আন্তর্জাতিক শিপিং উপলব্ধ' : 'International shipping available to select countries'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                {isBn ? 'রিটার্ন নীতি' : 'Return Policy'}
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isBn ? '৩০-দিনের ঝামেলামুক্ত রিটার্ন' : '30-day hassle-free returns'}</li>
                <li>{isBn ? 'আইটেমগুলি ট্যাগ সহ আসল অবস্থায় থাকতে হবে' : 'Items must be in original condition with tags'}</li>
                <li>{isBn ? 'সব অর্ডারে ফ্রি রিটার্ন' : 'Free returns on all orders'}</li>
                <li>{isBn ? '৫-৭ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া করা হয়' : 'Refund processed within 5-7 business days'}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: FAQ / Questions */}
        {activeTab === tabs[5] && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 text-base mb-4">
              {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
            </h3>
            <div className="bg-gray-50 rounded-lg p-2">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isBn={isBn}
                />
              ))}
            </div>
            {/* Ask Question Button */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-sm text-gray-700 mb-2">
                {isBn ? 'আপনার প্রশ্ন এখনো জবাব পায়নি?' : "Didn't find your answer?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  // এখানে আপনার মডাল বা কন্টাক্ট ফর্ম খোলার কোড দিতে পারেন
                  alert(isBn ? 'শীঘ্রই যোগাযোগ করা হবে!' : 'Will contact soon!');
                }}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
              >
                {isBn ? 'প্রশ্ন জিজ্ঞাসা করুন' : 'Ask a Question'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}