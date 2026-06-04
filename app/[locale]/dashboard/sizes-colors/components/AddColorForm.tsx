'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Color } from '../../data/initialData';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface AddColorFormProps {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    hex: string;
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const AddColorForm: React.FC<AddColorFormProps> = ({ colors, setColors }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন

  const [colorName, setColorName] = useState<string>('');
  const [colorNameBn, setColorNameBn] = useState<string>('');
  const [colorHex, setColorHex] = useState<string>('#3B82F6');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!colorName.trim()) {
      setError(language === 'bn' ? 'রঙের নাম (ইংরেজি) দিন' : 'Enter color name (English)');
      return;
    }
    
    if (!colorNameBn.trim()) {
      setError(language === 'bn' ? 'রঙের নাম (বাংলা) দিন' : 'Enter color name (Bangla)');
      return;
    }
    
    if (!colorHex.trim()) {
      setError(language === 'bn' ? 'রঙের হেক্স কোড দিন' : 'Enter color hex code');
      return;
    }

    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(colorHex)) {
      setError(language === 'bn' ? 'ভুল হেক্স কোড। ফরম্যাট: #RRGGBB' : 'Invalid hex code. Format: #RRGGBB');
      return;
    }

    setIsLoading(true);
    setError('');

    const objData = {
      name: colorName.trim(),
      nameBn: colorNameBn.trim(),
      hex: colorHex.toUpperCase(),
    };

    try {
      const res = await fetch("/api/color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (language === 'bn' ? "রঙ সংরক্ষণ করতে ব্যর্থ" : "Failed to save color"));
      }

      // Add the new color to the list
      if (data.success && data.data) {
        const newColor: Color = {
          _id: data.data._id,
          name: data.data.name,
          nameBn: data.data.nameBn,
          hex: data.data.hex,
          active: data.data.active,
        };
        
        setColors([newColor, ...colors]);
        toast.success(data.message || (language === 'bn' ? "রঙ সফলভাবে সংরক্ষণ হয়েছে!" : "Color saved successfully!"));
        
        // Clear form only on success
        setColorName('');
        setColorNameBn('');
        setColorHex('#3B82F6');
      } else {
        throw new Error(language === 'bn' ? "রঙ সংরক্ষণ করতে ব্যর্থ" : "Failed to save color");
      }
    } catch (error) {
      console.error("Error saving color:", error);
      const errorMessage = error instanceof Error ? error.message : (language === 'bn' ? "রঙ সংরক্ষণ করতে ব্যর্থ" : "Failed to save color");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder={language === 'bn' ? 'রঙের নাম (ইংরেজি)' : 'Name (English)'}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50"
          disabled={isLoading}
        />
        <input
          type="text"
          value={colorNameBn}
          onChange={(e) => setColorNameBn(e.target.value)}
          placeholder={language === 'bn' ? 'রঙের নাম (বাংলা)' : 'Name (Bangla)'}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
            disabled={isLoading}
          />
          <input
            type="text"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            placeholder="#HexCode"
            className="flex-1 text-sm focus:outline-none uppercase font-mono tracking-wider disabled:bg-transparent"
            maxLength={7}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {language === 'bn' ? 'যোগ' : 'Add'}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </form>
  );
};

export default AddColorForm;