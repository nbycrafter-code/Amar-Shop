// components/TableList.tsx
"use client";
import React, { useState } from "react";
import { Search, Edit, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  discountType?: string;
  stock: number;
  categoryName?: string;
  categoryNameBn?: string;
  subCategoryName?: string;
  subCategoryNameBn?: string;
  brandName?: string;
  brandNameBn?: string;
  sizeNames?: string[];
  colorHexes?: string[];
  colorNames?: string[];
  image: string;
  description?: string;
  descriptionBn?: string;
  slug: string;
  active?: boolean;
  sales?: number;
}

interface TableListProps {
  products: Product[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    price: number;
    oldPrice: number;
    discount: number;
    discountType: string;
    stock: number;
    category: string;
    subCategory: string;
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
  products,
}) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.nameBn &&
        product.nameBn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brandName && product.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.categoryName && product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.subCategoryName && product.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
          active: !currentStatus,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          (language === 'bn' ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"),
        );
      }

      if (data.success) {
        toast.success(
          data.message ||
          (language === 'bn'
            ? "স্ট্যাটাস সফলভাবে আপডেট হয়েছে!"
            : "Status updated successfully!"),
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : language === 'bn'
            ? "স্ট্যাটাস আপডেট করতে ব্যর্থ"
            : "Failed to update status",
      );
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteProduct = async (id: string) => {
    if (!id) {
      toast.error(language === 'bn' ? "পণ্য আইডি পাওয়া যায়নি" : "Product ID not found");
      return;
    }

    const confirmDelete = confirm(
      language === 'bn'
        ? "আপনি কি এই পণ্যটি ডিলিট করতে চান?"
        : "Are you sure you want to delete this product?",
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
        toast.success(
          data.message ||
          (language === 'bn' ? "পণ্য ডিলিট করা হয়েছে!" : "Product deleted successfully!"),
        );
        router.refresh();

        const currentProductList = filteredProducts.filter(
          (p) => p._id !== id && p.id !== id,
        );
        if (currentProductList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(
          data.error ||
          (language === 'bn' ? "পণ্য ডিলিট করতে ব্যর্থ" : "Failed to delete product"),
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : language === 'bn'
            ? "পণ্য ডিলিট করতে ব্যর্থ"
            : "Failed to delete product",
      );
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
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {language === 'bn' ? "সকল পণ্য তালিকা" : "Available Products"}
          </h2>
          <span className="text-xs text-slate-500">
            {filteredProducts.length}{" "}
            {language === 'bn' ? "টি পণ্য পাওয়া গেছে" : "products found"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {language === 'bn' ? "প্রতি পৃষ্ঠায় দেখান:" : "Show items:"}
            </span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
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
              placeholder={language === 'bn' ? "পণ্য অনুসন্ধান করুন..." : "Search products..."}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
              <th className="p-4">
                {language === 'bn' ? "পণ্যের ছবি ও নাম" : "Product & Info"}
              </th>
              <th className="p-4">
                {language === 'bn' ? "ক্যাটাগরি" : "Category"} / 
                {language === 'bn' ? "সাব-ক্যাটাগরি" : "Subcategory"}
                </th>
              <th className="p-4">{language === 'bn' ? "ব্র্যান্ড" : "Brand"}</th>
              <th className="p-4">{language === 'bn' ? "সাইজ ও রং" : "Sizes & Colors"}</th>
              <th className="p-4">{language === 'bn' ? "মূল্য" : "Price"}</th>
              <th className="p-4">{language === 'bn' ? "স্টক" : "Stock"}</th>
              <th className="p-4">{language === 'bn' ? "স্ট্যাটাস" : "Status"}</th>
              <th className="p-4">{language === 'bn' ? "অ্যাকশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedProducts.map((product) => (
              <tr
                key={product._id || product.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 line-clamp-1">
                        {language === 'bn' ? product.nameBn || product.name : product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {language === 'bn'
                          ? product.descriptionBn || product.description
                          : product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium text-center inline-block">
                    {language === 'bn'
                      ? product.categoryNameBn || product.categoryName
                      : product.categoryName}
                  </div>
                  {product.subCategoryName ? (
                    <div className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium text-center inline-block">
                      {language === 'bn'
                        ? product.subCategoryNameBn || product.subCategoryName
                        : product.subCategoryName}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 text-center inline-block">
                      {language === 'bn' ? "কোন সাব-ক্যাটাগরি নেই" : "No subcategory"}
                    </div>
                  )}
                </td>
                <td className="p-4 text-gray-600">
                  {language === 'bn' ? product.brandNameBn || product.brandName : product.brandName}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500">
                        {language === 'bn' ? "সাইজ:" : "Sizes:"}
                      </span>
                      {product.sizeNames && product.sizeNames.length > 0 ? (
                        product.sizeNames.map((size, i) => (
                          <span
                            key={i}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                          >
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs text-gray-500">
                        {language === 'bn' ? "রং:" : "Colors:"}
                      </span>
                      {product.colorHexes && product.colorHexes.length > 0 ? (
                        product.colorHexes.map((hex, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: hex }}
                            title={product.colorNames?.[i]}
                          />
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </div>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <div className="text-xs text-gray-400 line-through">
                      ৳{product.oldPrice.toLocaleString()}
                    </div>
                  )}
                  {product.discount && product.discount > 0 && (
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      {language === 'bn' ? "ছাড়:" : "Save:"}{" "}
                      {product.discountType === 'percentage' 
                        ? `${product.discount}%` 
                        : `৳${product.discount.toLocaleString()}`}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div>
                    <div className={`text-sm font-medium ${product.stock <= 10 ? "text-red-500" : "text-gray-700"}`}>
                      {product.stock} {language === 'bn' ? "টি" : "pcs"}
                    </div>
                    {product.sales !== undefined && (
                      <div className="text-xs text-gray-400 mt-1">
                        {language === 'bn' ? "বিক্রয়:" : "Sold:"} {product.sales}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      onUpdateStatus(
                        product._id || product.id || "",
                        product.active !== false,
                      )
                    }
                    disabled={isTogglingStatus === (product._id || product.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      product.active !== false
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isTogglingStatus === (product._id || product.id) ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                    ) : product.active !== false ? (
                      language === 'bn' ? "সক্রিয়" : "Active"
                    ) : language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/products/edit/${product.slug}`}
                      className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                      title={language === 'bn' ? "এডিট" : "Edit"}
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() =>
                        onDeleteProduct(product._id || product.id || "")
                      }
                      disabled={isDeleting === (product._id || product.id)}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={language === 'bn' ? "ডিলিট" : "Delete"}
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
                <td colSpan={9} className="text-center py-12 text-gray-500">
                  {language === 'bn' ? "কোনো পণ্য পাওয়া যায়নি" : "No products found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm bg-gray-50/50">
          <div className="text-gray-500">
            {language === 'bn' ? "দেখাচ্ছে" : "Showing"}
            <span className="font-semibold text-gray-900 mx-1">
              {filteredProducts.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>
            {language === 'bn' ? "থেকে" : "to"}
            <span className="font-semibold text-gray-900 mx-1">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>
            {language === 'bn' ? "মোট" : "of"}
            <span className="font-semibold text-gray-900 mx-1">
              {filteredProducts.length}
            </span>
            {language === 'bn' ? "এন্ট্রি" : "entries"}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              {language === 'bn' ? "পূর্ববর্তী" : "Previous"}
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
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              {language === 'bn' ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;