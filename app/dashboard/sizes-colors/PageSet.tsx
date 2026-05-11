'use client';
import React, { useState } from 'react';
import { Size, Color, initialColors } from '../data/initialData';
import AddSizeForm from './components/AddSizeForm';
import SizeList from './components/SizeList';
import AddColorForm from './components/AddColorForm';
import ColorList from './components/ColorList';
import { useApp } from '../context/AppContext';

interface SizesColorsViewProps {
  sizes?: Size[];
  colors?: Color[];
}

export const PageSet: React.FC<SizesColorsViewProps> = ({ sizesData, colorsData }) => {
  const { isBn } = useApp();
  const [sizes, setSizes] = useState<Size[]>(sizesData);
  const [colors, setColors] = useState<Color[]>(colorsData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBn ? 'সাইজ ও রঙসমূহ' : 'Sizes & Colors Configuration'}
          </h1>
          <p className="text-sm text-slate-500">
            {isBn ? 'পণ্যের সাইজ ভ্যারিয়েন্ট ও রঙের কোড নিয়ন্ত্রণ করুন' : 'Manage your product variant dimensions and custom color palette'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sizes Section */}
        <div>
          <AddSizeForm sizes={sizes} setSizes={setSizes} />
          <SizeList 
            sizes={sizes} setSizes={setSizes}
          />
        </div>

        {/* Colors Section */}
        <div>
          <AddColorForm colors={colors} setColors={setColors} />
          <ColorList 
            colors={colors} setColors={setColors}
          />
        </div>
      </div>
    </div>
  );
};