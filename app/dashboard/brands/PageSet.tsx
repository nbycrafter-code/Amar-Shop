'use client'
import React, { useState } from 'react';
import { Brand, initialBrands } from '../data/initialData';
import AddForm from './components/AddForm';
import TableList from './components/TableList';
import { useApp } from '../context/AppContext';

interface BrandsViewProps {
  brands?: Brand[];
}

export const PageSet: React.FC<BrandsViewProps> = ({ brandsData }) => {
  const { isBn } = useApp();
  const [brands, setBrands] = useState<Brand[]>(brandsData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBn ? 'ব্র্যান্ড সমূহ' : 'Brands Portfolio'}
          </h1>
          <p className="text-sm text-slate-500">
            {isBn ? 'পণ্য সরবরাহকারী ব্র্যান্ড এবং তাদের বিবরণ' : 'Manage supplier brands and manufacturers'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Brand Form Component */}
        <AddForm 
          brands={brands}
          setBrands={setBrands}
        />

        {/* Brands List Component */}
        <TableList 
          brands={brands}
          setBrands={setBrands}
        />
      </div>
    </div>
  );
};
