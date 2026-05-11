"use client";
import React, { useState } from "react";
import { Plus, Ruler } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Size } from "../../data/initialData";
import { getSlug } from "@/lib/convertData";
import { toast } from "sonner";

interface AddSizeFormProps {
  sizes: Size[];
  setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    slug: string;
    active?: boolean;
    created_at?: Date;
    updated_at?: Date;
  };
  error?: string;
}

const AddSizeForm: React.FC<AddSizeFormProps> = ({ sizes, setSizes }) => {
  const { isBn } = useApp();

  const [sizeName, setSizeName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!sizeName.trim()) {
      setError(isBn ? "সাইজের নাম দিন" : "Enter a size value");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const trimmedName = sizeName.trim();
    const slug = getSlug(trimmedName);
    
    const objData = {
      name: trimmedName,
      slug: slug,
    };
    
    try {
      const res = await fetch("/api/size", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "সাইজ সংরক্ষণ করতে ব্যর্থ" : "Failed to save size"));
      }

      // Update with real data from API
      if (data.success && data.data) {
        const newSize: Size = {
          _id: data.data._id,
          id: data.data._id,
          name: trimmedName,
          slug: slug,
          active: data.data.active || true,
        };
        
        setSizes([newSize, ...sizes]);
        toast.success(data.message || (isBn ? "সাইজ সফলভাবে সংরক্ষণ হয়েছে!" : "Size saved successfully!"));
        
        // Clear form only on success
        setSizeName("");
      } else {
        throw new Error(isBn ? "সাইজ সংরক্ষণ করতে ব্যর্থ" : "Failed to save size");
      }
    } catch (error) {
      console.error("Error saving size:", error);
      const errorMessage = error instanceof Error ? error.message : (isBn ? "সাইজ সংরক্ষণ করতে ব্যর্থ" : "Failed to save size");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2 mb-6">
      <input
        type="text"
        value={sizeName}
        onChange={(e) => setSizeName(e.target.value)}
        placeholder={isBn ? "যেমন: S, M, XL, 42" : "e.g. S, M, XL, 42"}
        className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isBn ? "যোগ" : "Add"}
      </button>
      {error && (
        <p className="text-xs text-rose-500 absolute -bottom-5 left-0">{error}</p>
      )}
    </form>
  );
};

export default AddSizeForm;