'use client'

import { SimplePage } from "../components/SimplePage";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, FileText, CreditCard, Truck, RefreshCw, UserCheck, AlertCircle, HelpCircle, Mail, Phone } from "lucide-react";

export const PageSet = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // Translations
  const texts = {
    title: isBn ? "শর্তাবলী ও নীতিমালা" : "Terms and Conditions",
    description: isBn 
      ? "এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি পেমেন্ট, ডেলিভারি ও রিটার্ন সংক্রান্ত আমাদের শর্তাবলীতে সম্মতি জানাচ্ছেন।"
      : "By using this website you agree to our terms on payment, delivery and returns.",
    
    // Overview
    overview: isBn ? "সাধারণ বিবরণ" : "Overview",
    overviewDesc: isBn 
      ? "এই শর্তাবলী ও নীতিমালা ('শর্তাবলী') MegaShop ওয়েবসাইটের ('আমরা', 'আমাদের', 'আমাদের') ব্যবহার নিয়ন্ত্রণ করে। আমাদের সাইট ব্যবহার করে, আপনি এই শর্তাবলী মেনে চলতে সম্মত হন।"
      : "These terms and conditions ('Terms') govern your use of the MegaShop website ('we', 'us', 'our'). By using our site, you agree to comply with these Terms.",
    
    // Account Registration
    accountTitle: isBn ? "অ্যাকাউন্ট নিবন্ধন" : "Account Registration",
    accountDesc: isBn 
      ? "আমাদের সাইট ব্যবহার করতে আপনার একটি অ্যাকাউন্ট তৈরি করতে হতে পারে। আপনি আপনার অ্যাকাউন্টের তথ্যের নিরাপত্তার জন্য দায়ী।"
      : "You may need to create an account to use our site. You are responsible for maintaining the security of your account information.",
    accountCondition1: isBn ? "আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে" : "You must be at least 18 years old",
    accountCondition2: isBn ? "সঠিক ও সম্পূর্ণ তথ্য প্রদান করতে হবে" : "You must provide accurate and complete information",
    accountCondition3: isBn ? "আপনি আপনার অ্যাকাউন্টের সকল কার্যকলাপের জন্য দায়ী" : "You are responsible for all activities under your account",
    
    // Orders & Payment
    ordersTitle: isBn ? "অর্ডার ও পেমেন্ট" : "Orders & Payment",
    ordersDesc: isBn 
      ? "অর্ডার করার মাধ্যমে আপনি পণ্যের মূল্য পরিশোধ করতে সম্মত হন। আমরা যেকোনো সময় অর্ডার বাতিল বা প্রত্যাখ্যান করার অধিকার সংরক্ষণ করি।"
      : "By placing an order, you agree to pay the price of the products. We reserve the right to cancel or refuse any order at any time.",
    paymentMethod1: isBn ? "ক্যাশ অন ডেলিভারি (নগদ)" : "Cash on Delivery (Cash)",
    paymentMethod2: isBn ? "অনলাইন পেমেন্ট (স্ট্রাইপ)" : "Online Payment (Stripe)",
    paymentMethod3: isBn ? "মোবাইল ব্যাংকিং" : "Mobile Banking",
    paymentMethod4: isBn ? "ক্রেডিট/ডেবিট কার্ড" : "Credit/Debit Card",
    
    // Shipping & Delivery
    shippingTitle: isBn ? "শিপিং ও ডেলিভারি" : "Shipping & Delivery",
    shippingDesc: isBn 
      ? "আমরা বাংলাদেশের সকল জেলায় ডেলিভারি প্রদান করি। ডেলিভারি সময় নির্ধারিত সময়ের চেয়ে বেশি লাগতে পারে।"
      : "We deliver to all districts in Bangladesh. Delivery may take longer than estimated.",
    shippingCondition1: isBn ? "ঢাকার মধ্যে ডেলিভারি সময়: ১-২ কার্যদিবস" : "Delivery within Dhaka: 1-2 business days",
    shippingCondition2: isBn ? "ঢাকার বাইরে ডেলিভারি সময়: ৩-৫ কার্যদিবস" : "Delivery outside Dhaka: 3-5 business days",
    shippingCondition3: isBn ? "₹২০০০ এর উপরে অর্ডারে ফ্রি শিপিং" : "Free shipping on orders above ₹2000",
    
    // Returns & Refunds
    returnsTitle: isBn ? "রিটার্ন ও রিফান্ড" : "Returns & Refunds",
    returnsDesc: isBn 
      ? "আপনি অর্ডার পাওয়ার ৩০ দিনের মধ্যে পণ্য ফেরত দিতে পারবেন। পণ্যটি অবশ্যই অক্ষত ও আসল প্যাকেজিংয়ে থাকতে হবে।"
      : "You can return products within 30 days of receiving the order. The product must be undamaged and in original packaging.",
    returnCondition1: isBn ? "ফেরত দেওয়ার জন্য ইনভয়েস প্রয়োজন" : "Invoice required for return",
    returnCondition2: isBn ? "রিফান্ড প্রসেস করতে ৫-৭ কার্যদিবস সময় লাগে" : "Refund takes 5-7 business days to process",
    
    // Privacy & Security
    privacyTitle: isBn ? "গোপনীয়তা ও নিরাপত্তা" : "Privacy & Security",
    privacyDesc: isBn 
      ? "আমরা আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও নিরাপত্তাকে গুরুত্ব দিই। আপনার তথ্য তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।"
      : "We value the privacy and security of your personal information. Your information will not be shared with third parties.",
    
    // Intellectual Property
    ipTitle: isBn ? "বুদ্ধিবৃত্তিক সম্পত্তি" : "Intellectual Property",
    ipDesc: isBn 
      ? "এই ওয়েবসাইটের সকল কন্টেন্ট, লোগো, ডিজাইন আমাদের সম্পত্তি এবং কপিরাইট আইন দ্বারা সুরক্ষিত।"
      : "All content, logos, and designs on this website are our property and protected by copyright laws.",
    
    // Limitation of Liability
    liabilityTitle: isBn ? "দায় সীমাবদ্ধতা" : "Limitation of Liability",
    liabilityDesc: isBn 
      ? "আমরা পণ্যের ব্যবহার, ক্ষতি বা ডেলিভারি বিলম্বের জন্য আইন অনুমোদিত সীমার বাইরে দায়ী থাকব না।"
      : "We shall not be liable for product use, damage, or delivery delays beyond the limits permitted by law.",
    
    // Changes to Terms
    changesTitle: isBn ? "শর্তাবলীর পরিবর্তন" : "Changes to Terms",
    changesDesc: isBn 
      ? "আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি। পরিবর্তনগুলি ওয়েবসাইটে পোস্ট করার পর কার্যকর হবে।"
      : "We reserve the right to modify these Terms at any time. Changes will be effective upon posting on the website.",
    
    // Contact Information
    contactTitle: isBn ? "যোগাযোগের তথ্য" : "Contact Information",
    contactDesc: isBn 
      ? "এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে, আমাদের সাথে যোগাযোগ করুন:"
      : "If you have any questions about these Terms, please contact us:",
    email: "support@megashop.com",
    phone: "01741571104",
    address: isBn ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh",
  };

  return (
    <SimplePage title={texts.title}>
      {/* Main Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <p className="text-blue-700">{texts.description}</p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          {texts.overview}
        </h2>
        <p className="text-gray-600">{texts.overviewDesc}</p>
      </div>

      {/* Account Registration */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-green-500" />
          {texts.accountTitle}
        </h2>
        <p className="text-gray-600 mb-3">{texts.accountDesc}</p>
        <ul className="space-y-2 text-gray-600 ml-4">
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.accountCondition1}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.accountCondition2}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            <span>{texts.accountCondition3}</span>
          </li>
        </ul>
      </div>

      {/* Orders & Payment */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          {texts.ordersTitle}
        </h2>
        <p className="text-gray-600 mb-3">{texts.ordersDesc}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-sm text-gray-600">{texts.paymentMethod1}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-sm text-gray-600">{texts.paymentMethod2}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-sm text-gray-600">{texts.paymentMethod3}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-sm text-gray-600">{texts.paymentMethod4}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Delivery */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-500" />
          {texts.shippingTitle}
        </h2>
        <p className="text-gray-600 mb-3">{texts.shippingDesc}</p>
        <ul className="space-y-2 text-gray-600 ml-4">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>{texts.shippingCondition1}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>{texts.shippingCondition2}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>{texts.shippingCondition3}</span>
          </li>
        </ul>
      </div>

      {/* Returns & Refunds */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-orange-500" />
          {texts.returnsTitle}
        </h2>
        <p className="text-gray-600 mb-3">{texts.returnsDesc}</p>
        <ul className="space-y-2 text-gray-600 ml-4">
          <li className="flex items-center gap-2">
            <span className="text-orange-500">•</span>
            <span>{texts.returnCondition1}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">•</span>
            <span>{texts.returnCondition2}</span>
          </li>
        </ul>
      </div>

      {/* Privacy & Security */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          {texts.privacyTitle}
        </h2>
        <p className="text-gray-600">{texts.privacyDesc}</p>
      </div>

      {/* Intellectual Property */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          {texts.ipTitle}
        </h2>
        <p className="text-gray-600">{texts.ipDesc}</p>
      </div>

      {/* Limitation of Liability */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          {texts.liabilityTitle}
        </h2>
        <p className="text-gray-600">{texts.liabilityDesc}</p>
      </div>

      {/* Changes to Terms */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-500" />
          {texts.changesTitle}
        </h2>
        <p className="text-gray-600">{texts.changesDesc}</p>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">{texts.contactTitle}</h3>
        </div>
        <p className="text-gray-600 mb-4">{texts.contactDesc}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <a href={`mailto:${texts.email}`} className="text-blue-600 hover:underline">
              {texts.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-500" />
            <a href={`tel:${texts.phone}`} className="text-blue-600 hover:underline">
              {texts.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{texts.address}</span>
          </div>
        </div>
      </div>

      {/* Last Updated Note */}
      <div className="mt-6 text-center text-sm text-gray-400">
        {isBn ? "সর্বশেষ আপডেট: জানুয়ারি ২০২৪" : "Last Updated: January 2024"}
      </div>
    </SimplePage>
  );
};