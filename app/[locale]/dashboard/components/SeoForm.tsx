"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  X,
  Loader2,
  Globe,
  FileText,
  Tag,
  Focus,
  Link as LinkIcon,
  Code,
  Eye,
  HelpCircle,
  Plus,
  Hash,
  Languages,
} from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SeoFormProps {
  productId?: string;
  pageId?: string;
  productName?: string;
  productNameBn?: string;
  pageType?: string;
  existingSeo?: {
    seoTitle?: string;
    seoTitleBn?: string;
    seoDescription?: string;
    seoDescriptionBn?: string;
    seoTags?: string[];
    seoTagsBn?: string[];
    primaryKeyword?: string;
    primaryKeywordBn?: string;
    secondaryKeywords?: string[];
    secondaryKeywordsBn?: string[];
    canonicalUrl?: string;
    schemaMarkup?: object;
    robotsMeta?: string;
  };
  isEdit?: boolean;
  onSuccess?: () => void;
}

const SeoForm: React.FC<SeoFormProps> = ({ 
  productId, 
  pageId,
  productName = "", 
  productNameBn = "",
  pageType = "page",
  existingSeo = {},
  isEdit = false,
  onSuccess
}) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const router = useRouter();

  // Form states - English
  const [seoTitle, setSeoTitle] = useState<string>(existingSeo?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState<string>(existingSeo?.seoDescription || "");
  const [seoTags, setSeoTags] = useState<string[]>(existingSeo?.seoTags || []);
  const [tagInput, setTagInput] = useState<string>("");
  const [primaryKeyword, setPrimaryKeyword] = useState<string>(existingSeo?.primaryKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(existingSeo?.secondaryKeywords || []);
  const [secondaryKeywordInput, setSecondaryKeywordInput] = useState<string>("");
  
  // Form states - Bengali
  const [seoTitleBn, setSeoTitleBn] = useState<string>(existingSeo?.seoTitleBn || "");
  const [seoDescriptionBn, setSeoDescriptionBn] = useState<string>(existingSeo?.seoDescriptionBn || "");
  const [seoTagsBn, setSeoTagsBn] = useState<string[]>(existingSeo?.seoTagsBn || []);
  const [tagInputBn, setTagInputBn] = useState<string>("");
  const [primaryKeywordBn, setPrimaryKeywordBn] = useState<string>(existingSeo?.primaryKeywordBn || "");
  const [secondaryKeywordsBn, setSecondaryKeywordsBn] = useState<string[]>(existingSeo?.secondaryKeywordsBn || []);
  const [secondaryKeywordInputBn, setSecondaryKeywordInputBn] = useState<string>("");
  
  const [canonicalUrl, setCanonicalUrl] = useState<string>(existingSeo?.canonicalUrl || "");
  const [schemaMarkup, setSchemaMarkup] = useState<string>(
    existingSeo?.schemaMarkup ? JSON.stringify(existingSeo?.schemaMarkup, null, 2) : ""
  );
  const [robotsMeta, setRobotsMeta] = useState<string>(existingSeo?.robotsMeta || "index,follow");

  // UI states
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [descriptionCharCount, setDescriptionCharCount] = useState<number>(0);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "bn">(language === 'bn' ? "bn" : "en");

  // SEO Preview
  const [previewData, setPreviewData] = useState({
    title: "",
    description: "",
    url: ""
  });

  // Update preview
  useEffect(() => {
    const currentTitle = activeLanguage === "bn" ? seoTitleBn : seoTitle;
    const currentDescription = activeLanguage === "bn" ? seoDescriptionBn : seoDescription;
    const currentProductName = activeLanguage === "bn" ? productNameBn : productName;
    
    setCharCount(currentTitle.length);
    setDescriptionCharCount(currentDescription.length);
    
    setPreviewData({
      title: currentTitle || currentProductName || "Page Title",
      description: currentDescription || "Page description will appear here",
      url: canonicalUrl || `https://amarshop.com/${pageType}/${productId || pageId}`
    });
  }, [seoTitle, seoTitleBn, seoDescription, seoDescriptionBn, productName, productNameBn, canonicalUrl, productId, pageId, pageType, activeLanguage]);

  // Tag handlers - English
  const handleAddTag = () => {
    if (tagInput.trim() && !seoTags.includes(tagInput.trim())) {
      setSeoTags([...seoTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSeoTags(seoTags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Tag handlers - Bengali
  const handleAddTagBn = () => {
    if (tagInputBn.trim() && !seoTagsBn.includes(tagInputBn.trim())) {
      setSeoTagsBn([...seoTagsBn, tagInputBn.trim()]);
      setTagInputBn("");
    }
  };

  const handleKeyPressBn = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTagBn();
    }
  };

  const handleRemoveTagBn = (tag: string) => {
    setSeoTagsBn(seoTagsBn.filter(t => t !== tag));
  };

  // Secondary Keywords handlers
  const handleAddSecondaryKeyword = () => {
    if (secondaryKeywordInput.trim() && !secondaryKeywords.includes(secondaryKeywordInput.trim())) {
      setSecondaryKeywords([...secondaryKeywords, secondaryKeywordInput.trim()]);
      setSecondaryKeywordInput("");
    }
  };

  const handleRemoveSecondaryKeyword = (keyword: string) => {
    setSecondaryKeywords(secondaryKeywords.filter(k => k !== keyword));
  };

  const handleAddSecondaryKeywordBn = () => {
    if (secondaryKeywordInputBn.trim() && !secondaryKeywordsBn.includes(secondaryKeywordInputBn.trim())) {
      setSecondaryKeywordsBn([...secondaryKeywordsBn, secondaryKeywordInputBn.trim()]);
      setSecondaryKeywordInputBn("");
    }
  };

  const handleRemoveSecondaryKeywordBn = (keyword: string) => {
    setSecondaryKeywordsBn(secondaryKeywordsBn.filter(k => k !== keyword));
  };

  const validateSeoData = () => {
    if (seoTitle && seoTitle.length > 60) {
      toast.error(language === 'bn' ? "SEO টাইটেল ৬০ অক্ষরের কম হতে হবে" : "SEO title must be less than 60 characters");
      return false;
    }
    
    if (seoDescription && seoDescription.length > 160) {
      toast.error(language === 'bn' ? "SEO বিবরণ ১৬০ অক্ষরের কম হতে হবে" : "SEO description must be less than 160 characters");
      return false;
    }
    
    if (seoTags.length > 10) {
      toast.error(language === 'bn' ? "সর্বোচ্চ ১০টি ট্যাগ যুক্ত করতে পারেন" : "Maximum 10 tags allowed");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productId && !pageId) {
      toast.error(language === 'bn' ? "পণ্য আইডি বা পৃষ্ঠা আইডি প্রয়োজন" : "Product ID or Page ID required");
      return;
    }

    if (!validateSeoData()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    let validSchemaMarkup = null;
    if (schemaMarkup) {
      try {
        validSchemaMarkup = JSON.parse(schemaMarkup);
      } catch (err) {
        toast.error(language === 'bn' ? "Schema Markup সঠিক JSON ফরম্যাটে দিন" : "Invalid JSON format for Schema Markup");
        setIsLoading(false);
        return;
      }
    }

    const seoData: any = {
      pageType,
      seoTitle: seoTitle || "",
      seoTitleBn: seoTitleBn || "",
      seoDescription: seoDescription || "",
      seoDescriptionBn: seoDescriptionBn || "",
      seoTags,
      seoTagsBn,
      primaryKeyword: primaryKeyword || "",
      primaryKeywordBn: primaryKeywordBn || "",
      secondaryKeywords,
      secondaryKeywordsBn,
      canonicalUrl: canonicalUrl || "",
      schemaMarkup: validSchemaMarkup,
      robotsMeta
    };

    if (productId) {
      seoData.productId = productId;
    } else if (pageId) {
      seoData.pageId = pageId;
    }

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seoData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (language === 'bn' ? "SEO ডাটা সংরক্ষণ করতে ব্যর্থ" : "Failed to save SEO data"));
      }

      if (data.success) {
        toast.success(data.message || (language === 'bn' ? "SEO ডাটা সফলভাবে সংরক্ষণ হয়েছে!" : "SEO data saved successfully!"));
        if (onSuccess) onSuccess();
        setSuccess(true);
        
        setTimeout(() => {
          setSuccess(false);
          router.refresh();
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error saving SEO data:", error);
      const errorMessage = error.message || (language === 'bn' ? "SEO ডাটা সংরক্ষণ করতে ব্যর্থ" : "Failed to save SEO data");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'bn' ? "SEO অপটিমাইজেশন" : "SEO Optimization"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {language === 'bn' 
                ? "পৃষ্ঠার জন্য SEO তথ্য যুক্ত করুন যা সার্চ ইঞ্জিনে র্যাঙ্কিং উন্নত করবে"
                : "Add SEO information for your page to improve search engine ranking"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            {language === 'bn' ? "SEO ডাটা সফলভাবে সংরক্ষণ করা হয়েছে!" : "SEO data saved successfully!"}
          </div>
        )}

        {/* Language Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveLanguage("en")}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeLanguage === "en"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Languages className="w-4 h-4 inline mr-2" />
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLanguage("bn")}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeLanguage === "bn"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Languages className="w-4 h-4 inline mr-2" />
            বাংলা
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - SEO Fields */}
          <div className="space-y-6">
            {/* SEO Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Globe className="w-4 h-4 inline mr-2" />
                {activeLanguage === "bn" ? "SEO টাইটেল (বাংলা)" : "SEO Title (English)"}
                <span className="text-gray-400 font-normal text-xs ml-2">
                  ({charCount}/60)
                </span>
              </label>
              <input
                type="text"
                value={activeLanguage === "bn" ? seoTitleBn : seoTitle}
                onChange={(e) => activeLanguage === "bn" 
                  ? setSeoTitleBn(e.target.value)
                  : setSeoTitle(e.target.value)
                }
                placeholder={activeLanguage === "bn" 
                  ? "পৃষ্ঠার জন্য বাংলা SEO টাইটেল" 
                  : "SEO title for the page"
                }
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                disabled={isLoading}
                maxLength={60}
              />
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <FileText className="w-4 h-4 inline mr-2" />
                {activeLanguage === "bn" ? "SEO বিবরণ (বাংলা)" : "SEO Description (English)"}
                <span className="text-gray-400 font-normal text-xs ml-2">
                  ({descriptionCharCount}/160)
                </span>
              </label>
              <textarea
                value={activeLanguage === "bn" ? seoDescriptionBn : seoDescription}
                onChange={(e) => activeLanguage === "bn"
                  ? setSeoDescriptionBn(e.target.value)
                  : setSeoDescription(e.target.value)
                }
                placeholder={activeLanguage === "bn"
                  ? "পৃষ্ঠার সংক্ষিপ্ত বাংলা বিবরণ SEO এর জন্য"
                  : "Brief page description for SEO"
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm resize-none"
                disabled={isLoading}
                maxLength={160}
              />
            </div>

            {/* Primary Keyword */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Focus className="w-4 h-4 inline mr-2" />
                {activeLanguage === "bn" ? "প্রাইমারি কীওয়ার্ড (বাংলা)" : "Primary Keyword (English)"}
              </label>
              <input
                type="text"
                value={activeLanguage === "bn" ? primaryKeywordBn : primaryKeyword}
                onChange={(e) => activeLanguage === "bn"
                  ? setPrimaryKeywordBn(e.target.value)
                  : setPrimaryKeyword(e.target.value)
                }
                placeholder={activeLanguage === "bn"
                  ? "মূল কীওয়ার্ড (যেমন: অনলাইন শপিং)"
                  : "Primary keyword (e.g., online shopping)"
                }
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Secondary Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Hash className="w-4 h-4 inline mr-2" />
                {activeLanguage === "bn" ? "সেকেন্ডারি কীওয়ার্ড (বাংলা)" : "Secondary Keywords (English)"}
                <span className="text-gray-400 font-normal text-xs ml-2">
                  ({activeLanguage === "bn" ? secondaryKeywordsBn.length : secondaryKeywords.length}/15)
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeLanguage === "bn" ? secondaryKeywordInputBn : secondaryKeywordInput}
                  onChange={(e) => activeLanguage === "bn"
                    ? setSecondaryKeywordInputBn(e.target.value)
                    : setSecondaryKeywordInput(e.target.value)
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      activeLanguage === "bn" ? handleAddSecondaryKeywordBn() : handleAddSecondaryKeyword();
                    }
                  }}
                  placeholder={activeLanguage === "bn"
                    ? "সেকেন্ডারি কীওয়ার্ড যোগ করুন"
                    : "Add secondary keyword"
                  }
                  className="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={activeLanguage === "bn" ? handleAddSecondaryKeywordBn : handleAddSecondaryKeyword}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(activeLanguage === "bn" ? secondaryKeywordsBn : secondaryKeywords).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => activeLanguage === "bn"
                        ? handleRemoveSecondaryKeywordBn(keyword)
                        : handleRemoveSecondaryKeyword(keyword)
                      }
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Tag className="w-4 h-4 inline mr-2" />
                {activeLanguage === "bn" ? "মেটা কীওয়ার্ড (বাংলা ট্যাগ)" : "Meta Keywords (English Tags)"}
                <span className="text-gray-400 font-normal text-xs ml-2">
                  ({activeLanguage === "bn" ? seoTagsBn.length : seoTags.length}/10)
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeLanguage === "bn" ? tagInputBn : tagInput}
                  onChange={(e) => activeLanguage === "bn"
                    ? setTagInputBn(e.target.value)
                    : setTagInput(e.target.value)
                  }
                  onKeyPress={activeLanguage === "bn" ? handleKeyPressBn : handleKeyPress}
                  placeholder={activeLanguage === "bn"
                    ? "বাংলা ট্যাগ যোগ করুন"
                    : "Add tag"
                  }
                  className="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={activeLanguage === "bn" ? handleAddTagBn : handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-semibold"
                >
                  {language === 'bn' ? "যোগ করুন" : "Add"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(activeLanguage === "bn" ? seoTagsBn : seoTags).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => activeLanguage === "bn"
                        ? handleRemoveTagBn(tag)
                        : handleRemoveTag(tag)
                      }
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                {language === 'bn' ? "ক্যানোনিকাল ইউআরএল" : "Canonical URL"}
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://amarshop.com/page-url"
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Robots Meta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {language === 'bn' ? "রোবটস মেটা" : "Robots Meta"}
              </label>
              <select
                value={robotsMeta}
                onChange={(e) => setRobotsMeta(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                disabled={isLoading}
              >
                <option value="index,follow">index, follow</option>
                <option value="noindex,follow">noindex, follow</option>
                <option value="index,nofollow">index, nofollow</option>
                <option value="noindex,nofollow">noindex, nofollow</option>
              </select>
            </div>

            {/* Schema Markup */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Code className="w-4 h-4 inline mr-2" />
                {language === 'bn' ? "স্কিমা মার্কআপ (JSON-LD)" : "Schema Markup (JSON-LD)"}
              </label>
              <textarea
                value={schemaMarkup}
                onChange={(e) => setSchemaMarkup(e.target.value)}
                placeholder='{"@context": "https://schema.org","@type": "WebPage"}'
                rows={6}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-mono"
                // disabled={isLoading}
                disabled={true}
                readOnly={true}
              />
            </div>

            {/* Preview Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
              >
                <Eye className="w-4 h-4" />
                {showPreview 
                  ? (language === 'bn' ? "প্রিভিউ লুকান" : "Hide Preview") 
                  : (language === 'bn' ? "Google সার্চ প্রিভিউ দেখুন" : "View Google Search Preview")}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {language === 'bn' ? "Google সার্চ প্রিভিউ" : "Google Search Preview"}
              <span className="text-xs text-gray-500 ml-2">
                ({activeLanguage === "bn" ? "বাংলা" : "English"})
              </span>
            </h3>
            <div className="space-y-2">
              <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                {previewData.title}
              </div>
              <div className="text-green-700 text-sm">
                {previewData.url}
              </div>
              <div className="text-gray-600 text-sm">
                {previewData.description}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSeoTitle(existingSeo?.seoTitle || "");
              setSeoTitleBn(existingSeo?.seoTitleBn || "");
              setSeoDescription(existingSeo?.seoDescription || "");
              setSeoDescriptionBn(existingSeo?.seoDescriptionBn || "");
              setSeoTags(existingSeo?.seoTags || []);
              setSeoTagsBn(existingSeo?.seoTagsBn || []);
              setPrimaryKeyword(existingSeo?.primaryKeyword || "");
              setPrimaryKeywordBn(existingSeo?.primaryKeywordBn || "");
              setSecondaryKeywords(existingSeo?.secondaryKeywords || []);
              setSecondaryKeywordsBn(existingSeo?.secondaryKeywordsBn || []);
              setCanonicalUrl(existingSeo?.canonicalUrl || "");
              setSchemaMarkup(existingSeo?.schemaMarkup ? JSON.stringify(existingSeo?.schemaMarkup, null, 2) : "");
              setRobotsMeta(existingSeo?.robotsMeta || "index,follow");
              setError("");
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
            disabled={isLoading}
          >
            {language === 'bn' ? "রিসেট" : "Reset"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {language === 'bn' ? "SEO ডাটা সংরক্ষণ করুন" : "Save SEO Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeoForm;