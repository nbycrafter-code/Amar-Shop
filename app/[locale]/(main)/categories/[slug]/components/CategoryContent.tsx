"use client";

import { useLanguage } from "@/context/LanguageContext";

export const CategoryContent = ({category}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-full mx-auto px-4 py-6 space-y-6">
      {/* Category Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          {isBn ? category?.nameBn : category?.name}
        </h1>
      </div>

      {/* Description */}
      <div className="overflow-hidden">
        {category?.description && (
          <div
            className="text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: isBn ? category.descriptionBn : category.description,
            }}
          />
        )}
      </div>
    </div>
  );
};