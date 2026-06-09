"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface PageSetProps {
  orders?: any[];
  settings?: any; // settings prop যোগ করা হলো
}

export const PageSet = ({ orders = [], settings = {} }: PageSetProps) => {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    
    // থিম কালার - সেটিংস থেকে নেওয়া
    const primaryColor = settings?.primaryColor || "#ef553f";
    const buttonHoverColor = settings?.buttonPrimaryHover || "#d4382c";
    const textColor = settings?.textColor || "#1F2937";
    const textMuted = settings?.textMuted || "#6B7280";
    const backgroundColor = settings?.backgroundColor || "#FFFFFF";
    const borderColor = settings?.borderColor || "#E5E7EB";
    const hoverBg = settings?.hoverBackground || "#F3F4F6";
    const successColor = settings?.successColor || "#10B981";
    const warningColor = settings?.warningColor || "#F59E0B";
    const infoColor = settings?.infoColor || "#3B82F6";
    const errorColor = settings?.errorColor || "#EF4444";
    
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

    // Get status color style
    const getStatusStyle = (status: string) => {
        const statusLower = status.toLowerCase();
        let bgColor, color;
        
        if (statusLower === 'completed') {
            bgColor = `${successColor}20`;
            color = successColor;
        } else if (statusLower === 'processing') {
            bgColor = `${warningColor}20`;
            color = warningColor;
        } else if (statusLower === 'shipped') {
            bgColor = `${infoColor}20`;
            color = infoColor;
        } else if (statusLower === 'cancelled') {
            bgColor = `${errorColor}20`;
            color = errorColor;
        } else if (statusLower === 'pending') {
            bgColor = `${warningColor}20`;
            color = warningColor;
        } else {
            bgColor = `${textMuted}20`;
            color = textMuted;
        }
        
        return { backgroundColor: bgColor, color: color };
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
                <div 
                    className="rounded-lg p-12 text-center"
                    style={{ backgroundColor: backgroundColor, border: `1px solid ${borderColor}` }}
                >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: hoverBg }}>
                        <svg className="w-10 h-10" fill="none" stroke={textMuted} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <p className="mb-4" style={{ color: textMuted }}>{texts.noOrdersFound}</p>
                    <Link
                        href="/shop"
                        className="inline-block px-4 py-2 text-white rounded-lg transition-colors"
                        style={{ backgroundColor: primaryColor }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
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
            <div 
                className="rounded-lg border p-1 flex gap-1 mb-6 overflow-x-auto"
                style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilterChange(tab.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all`}
                        style={{
                            backgroundColor: filter === tab.key ? primaryColor : 'transparent',
                            color: filter === tab.key ? '#FFFFFF' : textMuted
                        }}
                        onMouseEnter={(e) => {
                            if (filter !== tab.key) {
                                e.currentTarget.style.backgroundColor = hoverBg;
                                e.currentTarget.style.color = primaryColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (filter !== tab.key) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = textMuted;
                            }
                        }}
                    >
                        {tab.label}
                        {tab.key === "All" && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full" style={{ backgroundColor: filter === tab.key ? 'rgba(255,255,255,0.2)' : `${primaryColor}20` }}>
                                {orders.length}
                            </span>
                        )}
                        {tab.key !== "All" && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full" style={{ backgroundColor: filter === tab.key ? 'rgba(255,255,255,0.2)' : `${primaryColor}20` }}>
                                {orders.filter((o) => o.orderStatus?.toLowerCase() === tab.key.toLowerCase()).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div 
                className="rounded-lg border overflow-hidden"
                style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderBottomColor: borderColor, backgroundColor: hoverBg }}>
                                <th className="text-left py-3 px-4 font-semibold" style={{ color: textMuted }}>{texts.order}</th>
                                <th className="text-left py-3 px-4 font-semibold" style={{ color: textMuted }}>{texts.date}</th>
                                <th className="text-left py-3 px-4 font-semibold" style={{ color: textMuted }}>{texts.status}</th>
                                <th className="text-left py-3 px-4 font-semibold" style={{ color: textMuted }}>{texts.total}</th>
                                <th className="text-left py-3 px-4 font-semibold" style={{ color: textMuted }}>{texts.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map((order) => {
                                const statusStyle = getStatusStyle(order.orderStatus);
                                return (
                                    <tr
                                        key={order._id}
                                        className="border-b transition-colors"
                                        style={{ borderBottomColor: borderColor }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td className="py-3 px-4 font-medium" style={{ color: textColor }}>#{order.orderId}</td>
                                        <td className="py-3 px-4" style={{ color: textMuted }}>{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium" style={statusStyle}>
                                                {getStatusText(order.orderStatus)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4" style={{ color: textColor }}>
                                            ${order.total.toFixed(2)} {texts.for} {order.items?.length || 0}{" "}
                                            {(order.items?.length || 0) > 1 ? texts.items : texts.item}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link
                                                href={`/my-account/orders/${order.orderId}`}
                                                className="px-3 py-1.5 text-xs font-medium rounded transition-colors inline-block"
                                                style={{ border: `1px solid ${primaryColor}`, color: primaryColor }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = primaryColor;
                                                    e.currentTarget.style.color = '#FFFFFF';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = primaryColor;
                                                }}
                                            >
                                                {texts.view}
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginatedOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center" style={{ color: textMuted }}>
                                        {texts.noOrdersFound}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div 
                        className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
                        style={{ borderTopColor: borderColor, backgroundColor: hoverBg }}
                    >
                        <p className="text-sm" style={{ color: textMuted }}>
                            {texts.showing} <strong style={{ color: textColor }}>{paginatedOrders.length}</strong> {texts.of}{" "}
                            <strong style={{ color: textColor }}>{filteredOrders.length}</strong> {texts.orders}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm border rounded transition-colors"
                                style={{
                                    borderColor: borderColor,
                                    color: currentPage === 1 ? textMuted : textColor,
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === 1 ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== 1) {
                                        e.currentTarget.style.backgroundColor = hoverBg;
                                        e.currentTarget.style.color = primaryColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== 1) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = textColor;
                                    }
                                }}
                            >
                                ← {texts.prev}
                            </button>
                            
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === "number" && goToPage(page)}
                                    className="px-3 py-1.5 text-sm rounded transition-colors"
                                    style={{
                                        backgroundColor: currentPage === page ? primaryColor : 'transparent',
                                        color: currentPage === page ? '#FFFFFF' : (page === "..." ? textMuted : textColor),
                                        cursor: page === "..." ? 'default' : 'pointer',
                                        border: currentPage !== page && page !== "..." ? `1px solid ${borderColor}` : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (page !== "..." && currentPage !== page) {
                                            e.currentTarget.style.backgroundColor = hoverBg;
                                            e.currentTarget.style.color = primaryColor;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (page !== "..." && currentPage !== page) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = textColor;
                                        }
                                    }}
                                    disabled={page === "..."}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm border rounded transition-colors"
                                style={{
                                    borderColor: borderColor,
                                    color: currentPage === totalPages ? textMuted : textColor,
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === totalPages ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== totalPages) {
                                        e.currentTarget.style.backgroundColor = hoverBg;
                                        e.currentTarget.style.color = primaryColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== totalPages) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = textColor;
                                    }
                                }}
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