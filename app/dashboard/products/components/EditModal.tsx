'use client';
import React, { useState } from 'react';
import { X, Bold, Italic, List, ChevronDown, Search, Loader2 } from 'lucide-react';
import { Product, Category, Brand, Size, Color } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface EditModalProps {
  product: Product;
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
  onUpdate: (id: string, updatedFields: Partial<Product>) => void;
  onClose: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    price: number;
    stock: number;
    category: string;
    brand: string;
    sizes: string[];
    colors: string[];
    description: string;
    descriptionBn: string;
    image: string;
    multiImages: string[];
    video: string;
    slug: string;
    active: boolean;
    sales: number;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const EditModal: React.FC<EditModalProps> = ({ 
  product, categories, brands, sizes, colors, onUpdate, onClose 
}) => {  
  const { isBn } = useApp();
  const router = useRouter();

  const [editName, setEditName] = useState<string>(product.name);
  const [editNameBn, setEditNameBn] = useState<string>(product.nameBn || product.name);
  const [editPrice, setEditPrice] = useState<number>(product.price);
  const [editStock, setEditStock] = useState<number>(product.stock || 0);
  const [editCategory, setEditCategory] = useState<string>(product.category);
  const [editBrand, setEditBrand] = useState<string>(product.brand);
  const [editSizes, setEditSizes] = useState<string[]>(product.sizes || []);
  const [editColors, setEditColors] = useState<string[]>(product.colors || []);
  const [editDescription, setEditDescription] = useState<string>(product.description || '');
  const [editDescriptionBn, setEditDescriptionBn] = useState<string>(product.descriptionBn || product.description || '');
  const [editStatus, setEditStatus] = useState<boolean>(product.active !== false);
  
  const [editSizeSearch, setEditSizeSearch] = useState<string>('');
  const [editColorSearch, setEditColorSearch] = useState<string>('');
  const [editSizeDropdownOpen, setEditSizeDropdownOpen] = useState<boolean>(false);
  const [editColorDropdownOpen, setEditColorDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addTextFormatting = (type: string, target: 'en' | 'bn') => {
    const formatChars: Record<string, [string, string]> = {
      bold: ['**', '**'], 
      italic: ['*', '*'], 
      list: ['- ', '']
    };
    const [prefix, suffix] = formatChars[type] || ['', ''];
    if (target === 'en') {
      setEditDescription(prev => prev + `\n${prefix}Edited Text${suffix}`);
    } else {
      setEditDescriptionBn(prev => prev + `\n${prefix}সম্পাদিত টেক্সট${suffix}`);
    }
  };

  const filteredEditSizes = sizes.filter(s => 
    s.name.toLowerCase().includes(editSizeSearch.toLowerCase())
  );
  
  const filteredEditColors = colors.filter(c => 
    c.name.toLowerCase().includes(editColorSearch.toLowerCase()) || 
    (c.nameBn && c.nameBn.includes(editColorSearch))
  );

  const toggleSize = (sizeName: string) => {
    setEditSizes(prev => 
      prev.includes(sizeName) 
        ? prev.filter(s => s !== sizeName) 
        : [...prev, sizeName]
    );
  };

  const toggleColor = (colorHex: string) => {
    setEditColors(prev => 
      prev.includes(colorHex) 
        ? prev.filter(c => c !== colorHex) 
        : [...prev, colorHex]
    );
  };

  const handleUpdate = async () => {
    // Validation
    if (!editName.trim()) {
      toast.error(isBn ? "পণ্যের নাম দিন" : "Enter product name");
      return;
    }
    
    if (!editPrice || editPrice <= 0) {
      toast.error(isBn ? "সঠিক মূল্য দিন" : "Enter valid price");
      return;
    }
    
    if (!editCategory) {
      toast.error(isBn ? "ক্যাটাগরি নির্বাচন করুন" : "Select category");
      return;
    }
    
    if (!editBrand) {
      toast.error(isBn ? "ব্র্যান্ড নির্বাচন করুন" : "Select brand");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", product._id || product.id || '');
    formData.append("name", editName.trim());
    formData.append("nameBn", editNameBn.trim());
    formData.append("price", editPrice.toString());
    formData.append("stock", editStock.toString());
    formData.append("category", editCategory);
    formData.append("brand", editBrand);
    formData.append("sizes", JSON.stringify(editSizes));
    formData.append("colors", JSON.stringify(editColors));
    formData.append("description", editDescription);
    formData.append("descriptionBn", editDescriptionBn);
    formData.append("active", editStatus.toString());

    try {
      const res = await fetch("/api/product", {
        method: "PUT",
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "পণ্য আপডেট করতে ব্যর্থ" : "Failed to update product"));
      }

      if (data.success && data.data) {
        const updatedProduct: Product = {
          ...product,
          name: data.data.name,
          nameBn: data.data.nameBn,
          price: data.data.price,
          stock: data.data.stock,
          category: data.data.category,
          brand: data.data.brand,
          sizes: data.data.sizes,
          colors: data.data.colors,
          description: data.data.description,
          descriptionBn: data.data.descriptionBn,
          active: data.data.active,
          status: data.data.active ? "Active" : "Inactive",
        };
        
        onUpdate(product._id || product.id || '', updatedProduct);
        toast.success(data.message || (isBn ? "পণ্য সফলভাবে আপডেট হয়েছে!" : "Product updated successfully!"));
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? "পণ্য আপডেট করতে ব্যর্থ" : "Failed to update product"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">
            {isBn ? 'পণ্য সম্পাদনা করুন' : 'Edit Product'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'পণ্যের নাম (ইংরেজি) *' : 'Product Name (English) *'}
              </label>
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'পণ্যের নাম (বাংলা)' : 'Product Name (Bangla)'}
              </label>
              <input 
                type="text" 
                value={editNameBn} 
                onChange={(e) => setEditNameBn(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'মূল্য (৳) *' : 'Price (৳) *'}
              </label>
              <input 
                type="number" 
                value={editPrice} 
                onChange={(e) => setEditPrice(Number(e.target.value))} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'স্টক' : 'Stock'}
              </label>
              <input 
                type="number" 
                value={editStock} 
                onChange={(e) => setEditStock(Number(e.target.value))} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'ব্র্যান্ড *' : 'Brand *'}
              </label>
              <select 
                value={editBrand} 
                onChange={(e) => setEditBrand(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isLoading}
              >
                {brands.map((b) => (
                  <option key={b._id || b.id} value={b.name}>
                    {isBn ? b.nameBn || b.name : b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'ক্যাটাগরি *' : 'Category *'}
              </label>
              <select 
                value={editCategory} 
                onChange={(e) => setEditCategory(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isLoading}
              >
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c.name}>
                    {isBn ? c.nameBn || c.name : c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'সাইজ সম্পাদনা' : 'Edit Sizes'}
              </label>
              <button 
                type="button" 
                onClick={() => setEditSizeDropdownOpen(!editSizeDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <span className="truncate">
                  {editSizes.length > 0 
                    ? editSizes.join(', ') 
                    : (isBn ? 'সাইজ নির্বাচন করুন...' : 'Select sizes...')}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {editSizeDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={isBn ? 'সাইজ খুঁজুন...' : 'Search sizes...'} 
                        value={editSizeSearch} 
                        onChange={(e) => setEditSizeSearch(e.target.value)} 
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                    {filteredEditSizes.map(size => (
                      <button 
                        key={size._id || size.id} 
                        type="button" 
                        onClick={() => toggleSize(size.name)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          editSizes.includes(size.name) 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'রং সম্পাদনা' : 'Edit Colors'}
              </label>
              <button 
                type="button" 
                onClick={() => setEditColorDropdownOpen(!editColorDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <span className="truncate">
                  {editColors.length > 0 
                    ? editColors.join(', ') 
                    : (isBn ? 'রং নির্বাচন করুন...' : 'Select colors...')}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {editColorDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={isBn ? 'রং খুঁজুন...' : 'Search colors...'} 
                        value={editColorSearch} 
                        onChange={(e) => setEditColorSearch(e.target.value)} 
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                    {filteredEditColors.map(col => (
                      <button 
                        key={col._id || col.id} 
                        type="button" 
                        onClick={() => toggleColor(col.hex)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          editColors.includes(col.hex) 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: col.hex }} />
                        {isBn ? col.nameBn || col.name : col.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'বিবরণ (ইংরেজি)' : 'Description (English)'}
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                  <button 
                    type="button" 
                    onClick={() => addTextFormatting('bold', 'en')} 
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addTextFormatting('italic', 'en')} 
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addTextFormatting('list', 'en')} 
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <textarea 
                  rows={3} 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  className="w-full p-3 border-0 focus:ring-0 focus:outline-none text-sm resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'বিবরণ (বাংলা)' : 'Description (Bangla)'}
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                  <button 
                    type="button" 
                    onClick={() => addTextFormatting('bold', 'bn')} 
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addTextFormatting('italic', 'bn')} 
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addTextFormatting('list', 'bn')} 
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <textarea 
                  rows={3} 
                  value={editDescriptionBn} 
                  onChange={(e) => setEditDescriptionBn(e.target.value)} 
                  className="w-full p-3 border-0 focus:ring-0 focus:outline-none text-sm resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? 'পণ্য স্ট্যাটাস' : 'Product Status'}
              </label>
              <select 
                value={editStatus ? "Active" : "Inactive"} 
                onChange={(e) => setEditStatus(e.target.value === "Active")} 
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                disabled={isLoading}
              >
                <option value="Active">{isBn ? 'সক্রিয়' : 'Active'}</option>
                <option value="Inactive">{isBn ? 'নিষ্ক্রিয়' : 'Inactive'}</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose} 
                className="px-6 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                onClick={handleUpdate} 
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {isBn ? 'আপডেট করুন' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;