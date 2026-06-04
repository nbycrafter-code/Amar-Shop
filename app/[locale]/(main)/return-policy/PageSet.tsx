'use client'

import { SimplePage } from "../components/SimplePage";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Package, Clock, CreditCard, Truck, RefreshCw } from "lucide-react";

export const PageSet = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // Translations
  const texts = {
    title: isBn ? "রিটার্ন পলিসি" : "Return Policy",
    description: isBn 
      ? "আপনি ৩০ দিনের মধ্যে আসল প্যাকেজিং এবং ইনভয়েস সহ পণ্য ফেরত দিতে পারবেন।"
      : "You can return products within 30 days in original packaging with invoice.",
    
    // Additional content
    returnPolicyTitle: isBn ? "আমাদের রিটার্ন পলিসি" : "Our Return Policy",
    returnPolicyDesc: isBn 
      ? "আমরা আপনার সন্তুষ্টির বিষয়ে যত্নশীল। যদি আপনি আপনার কেনাকাটায় সম্পূর্ণ সন্তুষ্ট না হন, তাহলে নিচের শর্তাবলী অনুসরণ করে পণ্য ফেরত দিতে পারেন:"
      : "We care about your satisfaction. If you are not completely satisfied with your purchase, you may return the product following the conditions below:",
    
    // Conditions
    returnConditions: isBn ? "ফেরত দেওয়ার শর্তাবলী" : "Return Conditions",
    condition1: isBn 
      ? "পণ্যটি অর্ডার পাওয়ার ৩০ দিনের মধ্যে ফেরত দিতে হবে"
      : "Product must be returned within 30 days of receiving the order",
    condition2: isBn 
      ? "পণ্যটি অবশ্যই আসল প্যাকেজিংয়ে থাকতে হবে"
      : "Product must be in original packaging",
    condition3: isBn 
      ? "পণ্যের সাথে সব ট্যাগ ও লেবেল সংযুক্ত থাকতে হবে"
      : "All tags and labels must be attached to the product",
    condition4: isBn 
      ? "পণ্যটি ব্যবহার করা বা ক্ষতিগ্রস্ত হওয়া যাবে না"
      : "Product must be unused and undamaged",
    condition5: isBn 
      ? "সাথে অর্ডারের ইনভয়েস কপি জমা দিতে হবে"
      : "Order invoice copy must be submitted with the product",
    
    // Steps
    returnSteps: isBn ? "কিভাবে ফেরত দিবেন" : "How to Return",
    step1: isBn ? "আমাদের সাপোর্ট টিমকে ইমেইল করুন" : "Email our support team",
    step2: isBn ? "পণ্যটি আসল প্যাকেজিংয়ে প্যাক করুন" : "Pack the product in original packaging",
    step3: isBn ? "আমাদের ঠিকানায় পণ্যটি পাঠিয়ে দিন" : "Ship the product to our address",
    step4: isBn ? "আমরা পণ্য পেয়ে রিফান্ড প্রসেস করব" : "We will process the refund after receiving",
    
    // Refund Info
    refundInfo: isBn ? "রিফান্ড তথ্য" : "Refund Information",
    refundTime: isBn 
      ? "আমরা পণ্য পাওয়ার ৫-৭ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া করব"
      : "We will process the refund within 5-7 business days after receiving the product",
    refundMethod: isBn 
      ? "রিফান্ড আপনার মূল পেমেন্ট পদ্ধতিতে ফেরত দেওয়া হবে"
      : "Refund will be credited to your original payment method",
    
    // Non-returnable items
    nonReturnable: isBn ? "ফেরতযোগ্য নয় এমন পণ্য" : "Non-returnable Items",
    nonReturnable1: isBn ? "পার্সোনাল কেয়ার পণ্য (যেমন: সাজসজ্জা, মেকআপ)" : "Personal care products (e.g., cosmetics, makeup)",
    nonReturnable2: isBn ? "আন্ডারওয়্যার ও অন্তর্বাস" : "Underwear and intimate apparel",
    nonReturnable3: isBn ? "সফটওয়্যার ও ডিজিটাল পণ্য" : "Software and digital products",
    nonReturnable4: isBn ? "গিফট কার্ড ও ভাউচার" : "Gift cards and vouchers",
    
    // Contact
    needHelp: isBn ? "সাহায্য প্রয়োজন?" : "Need Help?",
    contactSupport: isBn 
      ? "আমাদের সাপোর্ট টিম ২৪/৭ আপনার প্রশ্নের উত্তর দিতে প্রস্তুত"
      : "Our support team is ready 24/7 to answer your questions",
    callUs: isBn ? "আমাদের কল করুন" : "Call Us",
    emailUs: isBn ? "ইমেইল করুন" : "Email Us",
    supportEmail: "support@megashop.com",
    supportPhone: "01741571104",
  };

  return (
    <SimplePage title={texts.title}>
      {/* Main Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700">{texts.description}</p>
      </div>

      {/* Return Policy Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-red-500" />
          {texts.returnPolicyTitle}
        </h2>
        <p className="text-gray-600 mb-4">{texts.returnPolicyDesc}</p>
      </div>

      {/* Conditions Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            {texts.returnConditions}
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>{texts.condition1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>{texts.condition2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>{texts.condition3}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>{texts.condition4}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>{texts.condition5}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            {texts.returnSteps}
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>{texts.step1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>{texts.step2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>{texts.step3}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>{texts.step4}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Refund Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          {texts.refundInfo}
        </h3>
        <div className="space-y-2 text-gray-600">
          <p>{texts.refundTime}</p>
          <p>{texts.refundMethod}</p>
        </div>
      </div>

      {/* Non-returnable Items */}
      <div className="bg-gray-50 rounded-lg p-5 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-500" />
          {texts.nonReturnable}
        </h3>
        <ul className="space-y-1 text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.nonReturnable1}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.nonReturnable2}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.nonReturnable3}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.nonReturnable4}</span>
          </li>
        </ul>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{texts.needHelp}</h3>
              <p className="text-sm text-gray-600">{texts.contactSupport}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${texts.supportPhone}`}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {texts.callUs}
            </a>
            <a
              href={`mailto:${texts.supportEmail}`}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {texts.emailUs}
            </a>
          </div>
        </div>
      </div>
    </SimplePage>
  );
};