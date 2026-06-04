'use client'
import React, { useState } from 'react';
import { Brand } from '../data/initialData';
import AddForm from './components/AddForm';
import TableList from './components/TableList';
import { useLanguage } from '@/context/LanguageContext';

interface BrandsViewProps {
  brandsData?: Brand[];
}

export const PageSet: React.FC<BrandsViewProps> = ({ brandsData = [] }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const [brands, setBrands] = useState<Brand[]>(brandsData);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brand");
      const data = await response.json();
      if (data.success && data.data) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
  };

  const handleBrandUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setEditingBrand(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {language === 'bn' ? 'ব্র্যান্ড সমূহ' : 'Brands Portfolio'}
          </h1>
          <p className="text-sm text-slate-500">
            {language === 'bn' ? 'পণ্য সরবরাহকারী ব্র্যান্ড এবং তাদের বিবরণ' : 'Manage supplier brands and manufacturers'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AddForm 
          brands={brands}
          setBrands={setBrands}
          editingBrand={editingBrand}
          onCancelEdit={handleCancelEdit}
          onUpdateSuccess={handleBrandUpdate}
        />
        <TableList 
          brands={brands}
          setBrands={setBrands}
          onEditBrand={handleEditBrand}
        />
      </div>
    </div>
  );
};