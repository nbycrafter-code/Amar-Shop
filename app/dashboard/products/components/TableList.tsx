'use client';
import React, { useState } from 'react';
import { Search, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TableListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onEditProduct: (product: Product) => void;
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

const TableList: React.FC<TableListProps> = ({ 
  products, setProducts, onEditProduct
}) => {
  const { isBn } = useApp();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.nameBn && product.nameBn.toLowerCase().includes(searchTerm.toLowerCase())) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const onUpdateStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);
    
    try {
      const res = await fetch("/api/product", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id, 
          active: !currentStatus 
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"));
      }

      if (data.success) {
        setProducts(products.map((p) => 
          (p._id === id || p.id === id) 
            ? { ...p, active: data.active, status: data.active ? "Active" : "Inactive" } 
            : p
        ));
        toast.success(data.message || (isBn ? "স্ট্যাটাস সফলভাবে আপডেট হয়েছে!" : "Status updated successfully!"));
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"));
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteProduct = async (id: string) => {
    if (!id) {
      toast.error(isBn ? 'পণ্য আইডি পাওয়া যায়নি' : 'Product ID not found');
      return;
    }

    // Confirm before delete
    const confirmDelete = confirm(
      isBn ? 'আপনি কি এই পণ্যটি ডিলিট করতে চান?' : 'Are you sure you want to delete this product?'
    );
    
    if (!confirmDelete) return;

    setIsDeleting(id);
    
    try {
      const res = await fetch("/api/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete product");
      }
      
      const data = await res.json();

      if (data.success) {
        // Update local state
        setProducts(products.filter((p) => p._id !== id && p.id !== id));
        
        toast.success(data.message || (isBn ? 'পণ্য ডিলিট成功了!' : 'Product deleted successfully!'));
        router.refresh();
        
        // Adjust current page if needed
        const currentProductList = filteredProducts.filter((p) => p._id !== id && p.id !== id);
        if (currentProductList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(data.error || (isBn ? 'পণ্য ডিলিট করতে ব্যর্থ' : 'Failed to delete product'));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? 'পণ্য ডিলিট করতে ব্যর্থ' : 'Failed to delete product'));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">{isBn ? 'প্রতি পৃষ্ঠায় দেখান:' : 'Show items:'}</span>
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder={isBn ? 'পণ্য অনুসন্ধান করুন...' : 'Search products...'} 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
              <th className="p-4">{isBn ? 'পণ্যের ছবি ও নাম' : 'Product & Info'}</th>
              <th className="p-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
              <th className="p-4">{isBn ? 'ব্র্যান্ড' : 'Brand'}</th>
              <th className="p-4">{isBn ? 'সাইজ ও রং' : 'Sizes & Colors'}</th>
              <th className="p-4">{isBn ? 'মূল্য ও স্টক' : 'Price & Stock'}</th>
              <th className="p-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
              <th className="p-4">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedProducts.map((product) => (
              <tr key={product._id || product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100" 
                    />
                    <div>
                      <div className="font-semibold text-gray-900 line-clamp-1">
                        {isBn ? product.nameBn || product.name : product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {isBn ? product.descriptionBn || product.description : product.description}
                      </div>
                    </div>
                  </div>
                 </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                    {product.category}
                  </span>
                 </td>
                <td className="p-4 text-gray-600">{product.brand}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500">{isBn ? 'সাইজ:' : 'Sizes:'}</span>
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map((size, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs text-gray-500">{isBn ? 'রং:' : 'Colors:'}</span>
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((hex, i) => (
                          <span 
                            key={i} 
                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" 
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                 </td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">৳{product.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isBn ? 'স্টক:' : 'Stock:'} 
                    <span className={`ml-1 font-medium ${product.stock <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  </div>
                  {product.sales !== undefined && (
                    <div className="text-xs text-gray-400 mt-1">
                      {isBn ? 'বিক্রয়:' : 'Sold:'} {product.sales}
                    </div>
                  )}
                 </td>
                <td className="p-4">
                  <button 
                    onClick={() => onUpdateStatus(product._id || product.id || '', product.active !== false)}
                    disabled={isTogglingStatus === (product._id || product.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      product.active !== false 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isTogglingStatus === (product._id || product.id) ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                    ) : product.active !== false 
                      ? (isBn ? 'সক্রিয়' : 'Active') 
                      : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                  </button>
                 </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEditProduct(product)} 
                      className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                      title={isBn ? 'এডিট' : 'Edit'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(product._id || product.id || '')} 
                      disabled={isDeleting === (product._id || product.id)}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isBn ? 'ডিলিট' : 'Delete'}
                    >
                      {isDeleting === (product._id || product.id) ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                 </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  {isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm bg-gray-50/50">
          <div className="text-gray-500">
            {isBn ? 'দেখাচ্ছে' : 'Showing'} 
            <span className="font-semibold text-gray-900 mx-1">
              {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span> 
            {isBn ? 'থেকে' : 'to'} 
            <span className="font-semibold text-gray-900 mx-1">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span> 
            {isBn ? 'মোট' : 'of'} 
            <span className="font-semibold text-gray-900 mx-1">
              {filteredProducts.length}
            </span> 
            {isBn ? 'এন্ট্রি' : 'entries'}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              {isBn ? 'পূর্ববর্তী' : 'Previous'}
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button 
                  key={pageNum} 
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                    currentPage === pageNum 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              {isBn ? 'পরবর্তী' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;