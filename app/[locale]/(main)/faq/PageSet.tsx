'use client'

import { useState } from "react";
import { SimplePage } from "../components/SimplePage";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

export const PageSet = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [open, setOpen] = useState<number>(-1);

  // FAQ items with bilingual support
  const getFAQItems = (): FAQItem[] => {
    if (isBn) {
      return [
        { question: "কিভাবে আমি আমার অর্ডার ট্র্যাক করব?", answer: "অর্ডার আইডি এবং বিলিং ইমেইল ব্যবহার করে ট্র্যাকিং পৃষ্ঠায় ট্র্যাক করুন।" },
        { question: "আমি কি পণ্য ফেরত দিতে পারব?", answer: "হ্যাঁ, আসল প্যাকেজ সহ ৩০ দিনের মধ্যে।" },
        { question: "আপনারা কি সারা বাংলাদেশে ডেলিভারি দেন?", answer: "হ্যাঁ, আমরা সারা দেশে ডেলিভারি দেই।" },
        { question: "পেমেন্টের পদ্ধতি কী কী?", answer: "ক্যাশ অন ডেলিভারি এবং অনলাইন পেমেন্ট (স্ট্রাইপ) উপলব্ধ।" },
        { question: "কত দিনে পণ্য হাতে পাব?", answer: "ঢাকার মধ্যে ১-২ দিন, ঢাকার বাইরে ৩-৫ দিন।" },
        { question: "অর্ডার বাতিল করতে চাইলে কী করব?", answer: "অর্ডার করার ১ ঘণ্টার মধ্যে আমাদের কল করুন।" }
      ];
    }
    return [
      { question: "How do I track my order?", answer: "Use order ID and billing email in tracking page." },
      { question: "Can I return products?", answer: "Yes, within 30 days with original package." },
      { question: "Do you ship all over Bangladesh?", answer: "Yes, we deliver nationwide." },
      { question: "What payment methods are available?", answer: "Cash on delivery and online payment (Stripe) available." },
      { question: "When will I receive my product?", answer: "1-2 days in Dhaka, 3-5 days outside Dhaka." },
      { question: "How to cancel an order?", answer: "Call us within 1 hour of placing the order." }
    ];
  };

  const items = getFAQItems();
  const pageTitle = isBn ? "সাধারণ জিজ্ঞাসা" : "FAQ";

  return (
    <SimplePage title={pageTitle}>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.question} className="rounded border border-gray-300 bg-white">
            <button 
              onClick={() => setOpen(open === idx ? -1 : idx)} 
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">{item.question}</span>
              <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open === idx ? "rotate-90" : ""}`} />
            </button>
            {open === idx && (
              <p className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* Contact Section */}
      <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isBn ? "এখনও প্রশ্ন আছে?" : "Still have questions?"}
        </h3>
        <p className="text-gray-600 mb-4">
          {isBn 
            ? "আমাদের সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত।" 
            : "Our support team is ready to help you."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="tel:01741571104" 
            className="inline-flex items-center justify-center gap-2 bg-[#ef553f] text-white px-6 py-2 rounded-lg hover:bg-[#d44a35] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {isBn ? "কল করুন: ০১৭৪১৫৭১১০৪" : "Call: 01741571104"}
          </a>
          <a 
            href="mailto:support@megashop.com" 
            className="inline-flex items-center justify-center gap-2 border border-[#ef553f] text-[#ef553f] px-6 py-2 rounded-lg hover:bg-[#ef553f] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isBn ? "ইমেইল পাঠান" : "Send Email"}
          </a>
        </div>
      </div>
    </SimplePage>
  );
};