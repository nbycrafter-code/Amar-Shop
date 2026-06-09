// app/brands/[slug]/components/BrandContent.tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FileText, Calendar, MapPin } from "lucide-react";

interface BrandContentProps {
  brand: {
    _id?: string;
    name: string;
    nameBn?: string;
    description?: string;
    descriptionBn?: string;
    country?: string;
    created_at?: Date;
    updated_at?: Date;
    itemCount?: number;
  } | null;
}

export const BrandContent = ({ brand }: BrandContentProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!brand) {
    return null;
  }

  const hasDescription = isBn ? brand.descriptionBn : brand.description;
  const description = hasDescription || (isBn ? brand.descriptionBn : brand.description);

  return (
    <div className="max-w-full mx-auto">
      {/* Brand Header */}
      <div className="border-b border-slate-200 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isBn ? 'ব্র্যান্ড সম্পর্কে' : 'About Brand'}
            </h2>
          </div>
          {brand.country && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>{brand.country}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      {description ? (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">
              {isBn ? 'বিবরণ' : 'Description'}
            </h3>
          </div>
          <div
            className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            {isBn ? 'কোন বিবরণ যোগ করা হয়নি' : 'No description added'}
          </p>
        </div>
      )}

      {/* Additional Info */}
      {brand.created_at && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {isBn ? 'যোগ করা হয়েছে:' : 'Added:'}{' '}
              {new Date(brand.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};