"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

const statusColors: Record<string, string> = {
    Processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
    Shipped: "bg-blue-100 text-blue-700 border-blue-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
    Pending: "bg-orange-100 text-orange-700 border-orange-200",
    Delivered: "bg-green-100 text-green-700 border-green-200"
};

export const PageSet = ({ orders = [] }) => {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Status text mapping
    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: isBn ? "বিবেচনাধীন" : "Pending",
            processing: isBn ? "প্রক্রিয়াকরণে" : "Processing",
            completed: isBn ? "সম্পন্ন" : "Completed",
            shipped: isBn ? "পাঠানো হয়েছে" : "Shipped",
            delivered: isBn ? "ডেলিভারি হয়েছে" : "Delivered",
            cancelled: isBn ? "বাতিল" : "Cancelled"
        };
        return statusMap[status.toLowerCase()] || status;
    };

    // Get status color class
    const getStatusClass = (status: string) => {
        const statusClassMap: { [key: string]: string } = {
            pending: "bg-orange-100 text-orange-700",
            processing: "bg-yellow-100 text-yellow-700",
            completed: "bg-green-100 text-green-700",
            shipped: "bg-blue-100 text-blue-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700"
        };
        return statusClassMap[status.toLowerCase()] || "bg-gray-100 text-gray-700";
    };

    // Filter tabs with translations
    const getTabs = () => {
        const tabs = [
            { key: "All", labelEn: "All", labelBn: "সব" },
            { key: "Pending", labelEn: "Pending", labelBn: "বিবেচনাধীন" },
            { key: "Processing", labelEn: "Processing", labelBn: "প্রক্রিয়াকরণে" },
            { key: "Shipped", labelEn: "Shipped", labelBn: "পাঠানো হয়েছে" },
            { key: "Completed", labelEn: "Completed", labelBn: "সম্পন্ন" },
            { key: "Cancelled", labelEn: "Cancelled", labelBn: "বাতিল" }
        ];
        
        return tabs.map(tab => ({
            ...tab,
            label: isBn ? tab.labelBn : tab.labelEn
        }));
    };

    const tabs = getTabs();

    // Filter orders based on selected tab
    const filteredOrders = useMemo(() => {
        if (filter === "All") return orders;
        return orders.filter((o) => o.orderStatus?.toLowerCase() === filter.toLowerCase());
    }, [filter, orders]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredOrders.slice(start, end);
    }, [filteredOrders, currentPage, itemsPerPage]);

    // Reset page when filter changes
    const handleFilterChange = (tabKey: string) => {
        setFilter(tabKey);
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Translations
    const texts = {
        order: isBn ? "অর্ডার" : "Order",
        date: isBn ? "তারিখ" : "Date",
        status: isBn ? "স্ট্যাটাস" : "Status",
        total: isBn ? "মোট" : "Total",
        actions: isBn ? "অ্যাকশন" : "Actions",
        view: isBn ? "দেখুন" : "View",
        for: isBn ? "এর জন্য" : "for",
        item: isBn ? "আইটেম" : "item",
        items: isBn ? "আইটেম" : "items",
        showing: isBn ? "দেখানো হচ্ছে" : "Showing",
        of: isBn ? "এর" : "of",
        orders: isBn ? "অর্ডার" : "orders",
        prev: isBn ? "পূর্ববর্তী" : "Prev",
        next: isBn ? "পরবর্তী" : "Next",
        noOrdersFound: isBn ? "কোন অর্ডার পাওয়া যায়নি" : "No orders found"
    };

    // Format date based on language
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (orders.length === 0) {
        return (
            <div className="flex-1 order-2 lg:order-1">
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 mb-4">{texts.noOrdersFound}</p>
                    <Link
                        href="/shop"
                        className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {isBn ? "শপিং শুরু করুন" : "Start Shopping"}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 order-2 lg:order-1">
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilterChange(tab.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                            filter === tab.key
                                ? "bg-red-500 text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab.label}
                        {tab.key === "All" && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                                {orders.length}
                            </span>
                        )}
                        {tab.key !== "All" && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                                {orders.filter((o) => o.orderStatus?.toLowerCase() === tab.key.toLowerCase()).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                    {texts.order}
                                </th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                    {texts.date}
                                </th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                    {texts.status}
                                </th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                    {texts.total}
                                </th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                    {texts.actions}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 font-medium text-gray-800">
                                        #{order.orderId}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}
                                        >
                                            {getStatusText(order.orderStatus)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-800">
                                        ${order.total.toFixed(2)} {texts.for} {order.items?.length || 0}{" "}
                                        {(order.items?.length || 0) > 1 ? texts.items : texts.item}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link
                                            href={`/my-account/orders/${order.orderId}`}
                                            className="px-3 py-1.5 border border-red-500 text-red-500 text-xs font-medium rounded hover:bg-red-500 hover:text-white transition-colors inline-block"
                                        >
                                            {texts.view}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {paginatedOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        {texts.noOrdersFound}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            {texts.showing} <strong>{paginatedOrders.length}</strong> {texts.of}{" "}
                            <strong>{filteredOrders.length}</strong> {texts.orders}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                                    currentPage === 1
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-200 hover:bg-gray-100 text-gray-600"
                                }`}
                            >
                                ← {texts.prev}
                            </button>
                            
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === "number" && goToPage(page)}
                                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                                        currentPage === page
                                            ? "bg-red-500 text-white font-medium"
                                            : page === "..."
                                            ? "cursor-default text-gray-400"
                                            : "border border-gray-200 hover:bg-gray-100 text-gray-600"
                                    }`}
                                    disabled={page === "..."}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                                    currentPage === totalPages
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-200 hover:bg-gray-100 text-gray-600"
                                }`}
                            >
                                {texts.next} →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};