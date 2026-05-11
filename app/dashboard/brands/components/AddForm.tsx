"use client";
import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Brand } from "../../data/initialData";
import { toast } from "sonner";

interface AddFormProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    country: string;
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const AddForm: React.FC<AddFormProps> = ({ brands, setBrands }) => {
  const { isBn } = useApp();
  
  const [name, setName] = useState<string>("");
  const [nameBn, setNameBn] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError(isBn ? "ব্র্যান্ডের নাম (ইংরেজি) দিন" : "Enter brand name (English)");
      return;
    }
    
    if (!nameBn.trim()) {
      setError(isBn ? "ব্র্যান্ডের নাম (বাংলা) দিন" : "Enter brand name (Bangla)");
      return;
    }
    
    if (!country.trim()) {
      setError(isBn ? "মূল দেশ দিন" : "Enter country of origin");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    const objData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      country: country.trim(),
    };

    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "ব্র্যান্ড সংরক্ষণ করতে ব্যর্থ" : "Failed to save brand"));
      }

      // Add the new brand to the list
      if (data.success && data.data) {
        const newBrand: Brand = {
          _id: data.data._id,
          id: data.data._id,
          name: data.data.name,
          nameBn: data.data.nameBn,
          country: data.data.country,
          active: data.data.active,
        };
        
        setBrands([...brands, newBrand]);
        toast.success(data.message || (isBn ? "ব্র্যান্ড সফলভাবে সংরক্ষণ হয়েছে!" : "Brand saved successfully!"));
        
        // Clear form only on success
        setName("");
        setNameBn("");
        setCountry("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(isBn ? "ব্র্যান্ড সংরক্ষণ করতে ব্যর্থ" : "Failed to save brand");
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      const errorMessage = error instanceof Error ? error.message : (isBn ? "ব্র্যান্ড সংরক্ষণ করতে ব্যর্থ" : "Failed to save brand");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        {isBn ? "নতুন ব্র্যান্ড যোগ করুন" : "Add New Brand"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ব্র্যান্ডের নাম (ইংরেজি)" : "Brand Name (English)"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apex"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ব্র্যান্ডের নাম (বাংলা)" : "Brand Name (Bangla)"}
          </label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="উদাঃ এপেক্স"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "মূল দেশ" : "Country of Origin"}
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Bangladesh"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {isBn ? "সফলভাবে যোগ করা হয়েছে!" : "Brand added successfully!"}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isBn ? "সংরক্ষণ করুন" : "Save Brand"}
        </button>
      </form>
    </div>
  );
};

export default AddForm;