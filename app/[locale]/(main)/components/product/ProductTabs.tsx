'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { taka } from '@/utils/helpers';

// ল্যাঙ্গুয়েজ অনুযায়ী ট্যাব নাম
const getTabs = (isBn: boolean) => {
  if (isBn) {
    return ['বিবরণ', 'অতিরিক্ত তথ্য', 'রিভিউ', 'শিপিং ও রিটার্ন', 'প্রশ্নোত্তর'];
  }
  return ['Description', 'Additional info', 'Reviews', 'Shipping & Return', 'FAQ'];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-200'}
        />
      ))}
    </div>
  );
}

// FAQ আইটেম কম্পোনেন্ট
function FAQItem({ question, answer, isBn, primaryColor, buttonHoverColor, textColor, textMuted, borderColor, hoverBg }: { 
  question: string; 
  answer: string; 
  isBn: boolean;
  primaryColor: string;
  buttonHoverColor: string;
  textColor: string;
  textMuted: string;
  borderColor: string;
  hoverBg: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b last:border-0" style={{ borderBottomColor: borderColor }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-2 text-left transition-colors"
        style={{ color: textColor }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        type="button"
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" style={{ color: primaryColor }} />
        ) : (
          <ChevronDown className="w-5 h-5" style={{ color: textMuted }} />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-sm" style={{ color: textMuted }}>
          {answer}
        </div>
      )}
    </div>
  );
}

interface ProductTabsProps {
  product: any;
  settings?: any;
}

export default function ProductTabs({ product, settings = {} }: ProductTabsProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#f97316";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#ea580c";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const gradientStart = settings?.gradientStart || "#f97316";
  const gradientEnd = settings?.gradientEnd || "#ea580c";

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
    <div className="mt-8 border rounded-lg overflow-hidden" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
      {/* Tab nav */}
      <div className="flex border-b overflow-x-auto" style={{ borderBottomColor: borderColor, backgroundColor: hoverBg }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            type="button"
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer`}
            style={{
              borderBottomColor: activeTab === tab ? primaryColor : 'transparent',
              color: activeTab === tab ? primaryColor : textMuted,
              backgroundColor: activeTab === tab ? cardBg : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = primaryColor;
                e.currentTarget.style.borderBottomColor = `${primaryColor}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = textMuted;
                e.currentTarget.style.borderBottomColor = 'transparent';
              }
            }}
          >
            {getTabDisplayName(tab)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {/* Tab 0: Description */}
        {activeTab === tabs[0] && (
          <div
            className="text-sm leading-relaxed"
            style={{ color: textMuted }}
            dangerouslySetInnerHTML={{
              __html: isBn ? product.longDescriptionBn : product.longDescription,
            }}
          />
        )}

        {/* Tab 1: Additional information */}
        {activeTab === tabs[1] && (
          <div className="text-sm" style={{ color: textMuted }}>
            <table className="w-full border-collapse">
              <tbody>
                {/* Header Row */}
                <tr style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}>
                  <th className="py-2 px-3 text-white font-bold">{isBn ? "বৈশিষ্ট্য" : "Attribute"}</th>
                  <th className="py-2 px-3 text-white font-bold">{isBn ? "মান" : "Value"}</th>
                </tr>

                {/* Name */}
                <tr className="border-t" style={{ borderTopColor: borderColor }}>
                  <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "নাম" : "Name"}</th>
                  <td className="py-2 px-3" style={{ color: textMuted }}>{isBn ? (product.nameBn || product.name) : product.name}</td>
                </tr>

                {/* Brand */}
                <tr className="border-t" style={{ borderTopColor: borderColor }}>
                  <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "ব্র্যান্ড" : "Brand"}</th>
                  <td className="py-2 px-3" style={{ color: textMuted }}>{product.brandName || "Creative"}</td>
                </tr>

                {/* Category */}
                <tr className="border-t" style={{ borderTopColor: borderColor }}>
                  <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "ক্যাটাগরি" : "Category"}</th>
                  <td className="py-2 px-3" style={{ color: textMuted }}>{product.categoryName || "Uncategorized"}</td>
                </tr>

                {/* Color */}
                {product.colorHexes && product.colorHexes.length > 0 && (
                  <tr className="border-t" style={{ borderTopColor: borderColor }}>
                    <th className="py-2 px-3 font-medium align-top pt-3" style={{ color: textColor }}>
                      {isBn ? "রঙ" : "Color"}
                    </th>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.colorHexes.map((color, i) => (
                          <div key={i} className='flex flex-col justify-center items-center'>
                            <div
                              title={isBn ? product.colorNamesBn?.[i] : product.colorNames?.[i]}
                              className={`w-7 h-7 rounded-full border-2 transition-all`}
                              style={{ backgroundColor: color, borderColor: borderColor }}
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Size */}
                {product.sizeNames && product.sizeNames.length > 0 && (
                  <tr className="border-t" style={{ borderTopColor: borderColor }}>
                    <th className="py-2 px-3 font-medium align-top pt-3" style={{ color: textColor }}>
                      {isBn ? "সাইজ" : "Size"}
                    </th>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.sizeNames.map((size, i) => {
                          const sizeBn = product.sizeNamesBn?.[i] || size;
                          return (
                            <button
                              key={size}
                              className={`px-3 py-1 text-sm border rounded font-medium transition-all`}
                              style={{ borderColor: borderColor, color: textMuted }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = primaryColor;
                                e.currentTarget.style.color = primaryColor;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = borderColor;
                                e.currentTarget.style.color = textMuted;
                              }}
                            >
                              {isBn ? sizeBn : size}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs font-medium mt-2" style={{ color: primaryColor }}>
                        {product.stock || 0} {isBn ? "স্টকে আছে" : "in stock"}
                      </p>
                    </td>
                  </tr>
                )}

                {/* Price */}
                <tr className="border-t" style={{ borderTopColor: borderColor }}>
                  <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "দাম" : "Price"}</th>
                  <td className="py-2 px-3" style={{ color: primaryColor }}>{taka(product.price)}</td>
                </tr>

                {/* Stock */}
                <tr className="border-t" style={{ borderTopColor: borderColor }}>
                  <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "স্টক" : "Stock"}</th>
                  <td className="py-2 px-3" style={{ color: textMuted }}>{product.stock || 0} {isBn ? "আইটেম" : "items"}</td>
                </tr>

                {/* Rating */}
                <tr className="border-t" style={{ borderTopColor: borderColor }}>
                  <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "রেটিং" : "Rating"}</th>
                  <td className="py-2 px-3">
                    <StarRating rating={product.rating || 4} />
                  </td>
                </tr>

                {/* Section */}
                {product.section && product.section !== "none" && (
                  <tr className="border-t" style={{ borderTopColor: borderColor }}>
                    <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "সেকশন" : "Section"}</th>
                    <td className="py-2 px-3 capitalize" style={{ color: textMuted }}>{product.section.replace("-", " ")}</td>
                  </tr>
                )}

                {/* Product Type */}
                {product.productType && (
                  <tr className="border-t" style={{ borderTopColor: borderColor }}>
                    <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "টাইপ" : "Type"}</th>
                    <td className="py-2 px-3 capitalize" style={{ color: textMuted }}>{product.productType}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === tabs[2] && (
          <div className="space-y-4">
            <h3 className="font-semibold text-base" style={{ color: textColor }}>
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
              <div key={index} className="border-b pb-4" style={{ borderBottomColor: borderColor }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: textColor }}>{review.name}</p>
                    <p className="text-xs" style={{ color: textMuted }}>{review.date}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm pl-11" style={{ color: textMuted }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Shipping & Return */}
        {activeTab === tabs[3] && (
          <div className="text-sm space-y-4" style={{ color: textMuted }}>
            <div>
              <h4 className="font-semibold mb-1" style={{ color: textColor }}>
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
              <h4 className="font-semibold mb-1" style={{ color: textColor }}>
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

        {/* Tab 4: FAQ / Questions */}
        {activeTab === tabs[4] && (
          <div className="space-y-2">
            <h3 className="font-semibold text-base mb-4" style={{ color: textColor }}>
              {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
            </h3>
            <div className="rounded-lg p-2" style={{ backgroundColor: hoverBg }}>
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isBn={isBn}
                  primaryColor={primaryColor}
                  buttonHoverColor={buttonHoverColor}
                  textColor={textColor}
                  textMuted={textMuted}
                  borderColor={borderColor}
                  hoverBg={hoverBg}
                />
              ))}
            </div>
            {/* Ask Question Button */}
            <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: `${primaryColor}20` }}>
              <p className="text-sm mb-2" style={{ color: textMuted }}>
                {isBn ? 'আপনার প্রশ্ন এখনো জবাব পায়নি?' : "Didn't find your answer?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  alert(isBn ? 'শীঘ্রই যোগাযোগ করা হবে!' : 'Will contact soon!');
                }}
                className="px-4 py-2 text-white text-sm rounded-lg transition-colors"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
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