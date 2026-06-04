"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext"; // ✅ যোগ করুন

// Types
interface Order {
  id: string;
  orderId?: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  items_count: number;
}

interface UserData {
  name: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    orders: Order[];
    pagination?: any;
  };
  user?: UserData;
}

export const PageSet = () => {
  const { data: session, status } = useSession();
  const { language } = useLanguage(); // ✅ যোগ করুন
  const isBn = language === 'bn';
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completed: 0,
    processing: 0,
  });

  // Translations
  const texts = {
    loading: isBn ? "ড্যাশবোর্ড লোড হচ্ছে..." : "Loading dashboard...",
    pleaseLogin: isBn ? "ড্যাশবোর্ড দেখতে লগইন করুন" : "Please login to view your dashboard.",
    login: isBn ? "লগইন" : "Login",
    hello: isBn ? "হ্যালো" : "Hello",
    not: isBn ? "(নয়" : "(not",
    logOut: isBn ? "লগআউট" : "Log out",
    fromYourAccount: isBn ? "আপনার অ্যাকাউন্ট ড্যাশবোর্ড থেকে আপনি আপনার" : "From your account dashboard you can view your",
    recentOrders: isBn ? "সাম্প্রতিক অর্ডার" : "recent orders",
    manageYour: isBn ? ", আপনার" : ", manage your",
    shippingAndBillingAddresses: isBn ? "শিপিং ও বিলিং ঠিকানা" : "shipping and billing addresses",
    and: isBn ? ", এবং" : ", and",
    editYourPassword: isBn ? "আপনার পাসওয়ার্ড ও অ্যাকাউন্ট বিবরণ এডিট করুন" : "edit your password and account details",
    totalOrders: isBn ? "মোট অর্ডার" : "Total Orders",
    completed: isBn ? "সম্পন্ন" : "Completed",
    processing: isBn ? "প্রক্রিয়াকরণে" : "Processing",
    quickLinks: isBn ? "দ্রুত লিঙ্ক" : "Quick Links",
    viewOrders: isBn ? "অর্ডার দেখুন" : "View Orders",
    accountDetails: isBn ? "অ্যাকাউন্ট বিবরণ" : "Account Details",
    myAddresses: isBn ? "আমার ঠিকানা" : "My Addresses",
    wishlist: isBn ? "উইশলিস্ট" : "Wishlist",
    recentOrdersTitle: isBn ? "সাম্প্রতিক অর্ডার" : "Recent Orders",
    viewAll: isBn ? "সব দেখুন →" : "View All →",
    noOrdersFound: isBn ? "কোন অর্ডার পাওয়া যায়নি।" : "No orders found.",
    startShopping: isBn ? "শপিং শুরু করুন" : "Start Shopping",
    order: isBn ? "অর্ডার" : "Order",
    date: isBn ? "তারিখ" : "Date",
    status: isBn ? "স্ট্যাটাস" : "Status",
    total: isBn ? "মোট" : "Total",
    actions: isBn ? "অ্যাকশন" : "Actions",
    view: isBn ? "দেখুন" : "View",
    item: isBn ? "আইটেম" : "item",
    items: isBn ? "আইটেম" : "items",
    for: isBn ? "এর জন্য" : "for"
  };

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
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-orange-100 text-orange-700",
      completed: "bg-green-100 text-green-700",
      shipped: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700"
    };
    return statusClassMap[status.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
      fetchOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data: ApiResponse = await response.json();
      if (data.success && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/orders");
      const result: ApiResponse = await response.json();
      console.log(result);
      
      if (result.success && result.data?.orders) {
        const ordersData = result.data.orders;
        setOrders(ordersData);
        
        const totalOrders = ordersData.length;
        const completed = ordersData.filter(
          (order: Order) => order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "delivered"
        ).length;
        const processing = ordersData.filter(
          (order: Order) => order.status.toLowerCase() === "processing" || order.status.toLowerCase() === "pending"
        ).length;
        
        setStats({
          totalOrders,
          completed,
          processing,
        });
      } else {
        setOrders([]);
        setStats({
          totalOrders: 0,
          completed: 0,
          processing: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{texts.loading}</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{texts.pleaseLogin}</p>
          <Link
            href="/login"
            className="inline-block mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {texts.login}
          </Link>
        </div>
      </div>
    );
  }

  const userName = userData?.name || session?.user?.name || (isBn ? "ব্যবহারকারী" : "User");

  return (
    <div className="flex-1">
      {/* Welcome message */}
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        {texts.hello} <strong className="text-gray-800">{userName}</strong> ({texts.not} {userName}?{" "}
        <button onClick={handleLogout} className="text-red-500 hover:underline">
          {texts.logOut}
        </button>
        )
      </p>

      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        {texts.fromYourAccount}{" "}
        <Link
          href="/my-account/orders"
          className="text-red-500 hover:underline"
        >
          {texts.recentOrders}
        </Link>
        {texts.manageYour}{" "}
        <Link
          href="/my-account/addresses"
          className="text-red-500 hover:underline"
        >
          {texts.shippingAndBillingAddresses}
        </Link>
        {texts.and}{" "}
        <Link
          href="/my-account/account-details"
          className="text-red-500 hover:underline"
        >
          {texts.editYourPassword}
        </Link>
        .
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: texts.totalOrders,
            value: stats.totalOrders.toString(),
            icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: texts.completed,
            value: stats.completed.toString(),
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "bg-green-50 text-green-600",
          },
          {
            label: texts.processing,
            value: stats.processing.toString(),
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "bg-orange-50 text-orange-600",
          },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`rounded-lg p-5 ${color.split(" ")[0]} border border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={icon}
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{texts.quickLinks}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {[
          {
            label: texts.viewOrders,
            page: "orders",
            icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
          },
          {
            label: texts.accountDetails,
            page: "account-details",
            icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
          },
          {
            label: texts.myAddresses,
            page: "addresses",
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
          },
          {
            label: texts.wishlist,
            page: "wishlist",
            icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
          },
        ].map(({ label, page, icon }) => (
          <Link
            key={label}
            href={`/my-account/${page}`}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:border-red-300 hover:bg-red-50 transition-all group text-left"
          >
            <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={icon}
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-red-500 font-medium">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{texts.recentOrdersTitle}</h2>
          <Link
            href="/my-account/orders"
            className="text-sm text-red-500 hover:underline font-medium"
          >
            {texts.viewAll}
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{texts.noOrdersFound}</p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {texts.startShopping}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">
                    {texts.order}
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    {texts.date}
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    {texts.status}
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    {texts.total}
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    {texts.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 font-medium text-gray-800">
                      #{order.order_number || order.orderId}
                    </td>
                    <td className="py-3 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString(
                        isBn ? "bn-BD" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-800">
                      ${order.total_amount.toFixed(2)} {texts.for} {order.items_count}{" "}
                      {order.items_count > 1 ? texts.items : texts.item}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/my-account/orders/${order.orderId || order.id}`}
                        className="px-3 py-1.5 border border-red-500 text-red-500 text-xs font-medium rounded hover:bg-red-500 hover:text-white transition-colors"
                      >
                        {texts.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};