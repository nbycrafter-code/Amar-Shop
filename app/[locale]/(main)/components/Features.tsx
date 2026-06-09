'use client'

import { CreditCard, Package, RefreshCw, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FeatureItem {
  icon: any;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

interface FeaturesProps {
  settings?: any; // settings prop যোগ করা হলো
}

export const Features = ({ settings = {} }: FeaturesProps) => {
  const { language } = useLanguage();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const iconBg = settings?.hoverBackground || "#F3F4F6";
  const borderColor = settings?.borderColor || "#E5E7EB";

  const features: FeatureItem[] = [
    {
      icon: CreditCard,
      titleBn: '৫% পর্যন্ত পুরস্কার',
      titleEn: 'Upto 5% Reward',
      subtitleBn: 'আপনার শিপিং এ',
      subtitleEn: 'On your shipping'
    },
    {
      icon: RefreshCw,
      titleBn: 'সহজে রিটার্ন',
      titleEn: 'Easy to Returns',
      subtitleBn: 'ফেরতযোগ্য',
      subtitleEn: 'Returned'
    },
    {
      icon: Truck,
      titleBn: 'সেরা ডেলিভারি',
      titleEn: 'Best Delivery',
      subtitleBn: '২৪/৭ উপলব্ধ',
      subtitleEn: '24/7 available'
    },
    {
      icon: Package,
      titleBn: 'ফ্রি শিপিং',
      titleEn: 'Free shipping',
      subtitleBn: 'সব পণ্যের জন্য',
      subtitleEn: 'For all products'
    }
  ];

  return (
    <section className="py-8" style={{ backgroundColor: backgroundColor }}>
      <div className="container mx-auto w-full px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg flex items-center gap-3 transition-all duration-300 hover:shadow-md"
              style={{ 
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: iconBg }}
              >
                <feature.icon className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: textColor }}>
                  {language === 'bn' ? feature.titleBn : feature.titleEn}
                </p>
                <p className="text-xs" style={{ color: textMuted }}>
                  {language === 'bn' ? feature.subtitleBn : feature.subtitleEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};