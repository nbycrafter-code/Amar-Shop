// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { taka } from "@/utils/currency";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  items: any[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    orderStatus: "",
    paymentStatus: "",
    search: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [filter, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter.orderStatus && { orderStatus: filter.orderStatus }),
        ...(filter.paymentStatus && { paymentStatus: filter.paymentStatus }),
        ...(filter.search && { search: filter.search })
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        setPagination({
          page: data.page,
          total: data.total,
          totalPages: data.totalPages,
          limit: pagination.limit
        });
      } else {
        console.error("Failed to fetch orders:", data.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/admin/orders/statistics");
      const data = await response.json();
      if (response.ok) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSelection = prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId];
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
      setShowBulkActions(false);
    } else {
      setSelectedOrders(orders.map(order => order._id));
      setShowBulkActions(true);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (!confirm(`Update ${selectedOrders.length} orders to ${status}?`)) return;

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders, orderStatus: status })
      });

      if (response.ok) {
        alert(`${selectedOrders.length} orders updated successfully`);
        setSelectedOrders([]);
        setShowBulkActions(false);
        fetchOrders();
        fetchStatistics();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update orders");
      }
    } catch (error) {
      console.error("Error updating orders:", error);
      alert("Failed to update orders");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedOrders.length} orders? This action cannot be undone.`)) return;

    try {
      const response = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders })
      });

      if (response.ok) {
        alert(`${selectedOrders.length} orders deleted successfully`);
        setSelectedOrders([]);
        setShowBulkActions(false);
        fetchOrders();
        fetchStatistics();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete orders");
      }
    } catch (error) {
      console.error("Error deleting orders:", error);
      alert("Failed to delete orders");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        fetchStatistics();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-2">সকল অর্ডার দেখুন এবং ম্যানেজ করুন</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">মোট অর্ডার</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalOrders}</p>
                </div>
                <i className="fas fa-shopping-cart text-3xl text-blue-500"></i>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">মোট রেভিনিউ</p>
                  <p className="text-2xl font-bold text-green-600">{taka(statistics.totalRevenue)}</p>
                </div>
                <i className="fas fa-dollar-sign text-3xl text-green-500"></i>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">বিবেচনাধীন</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pendingOrders}</p>
                </div>
                <i className="fas fa-clock text-3xl text-yellow-500"></i>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">ডেলিভারি সম্পন্ন</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.deliveredOrders}</p>
                </div>
                <i className="fas fa-check-circle text-3xl text-green-500"></i>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="অর্ডার আইডি, নাম বা মোবাইল দ্বারা খুঁজুন..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={filter.orderStatus}
              onChange={(e) => setFilter({ ...filter, orderStatus: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="pending">বিবেচনাধীন</option>
              <option value="confirmed">কনফার্মড</option>
              <option value="processing">প্রক্রিয়াকরণে</option>
              <option value="shipped">পাঠানো হয়েছে</option>
              <option value="delivered">ডেলিভারি সম্পন্ন</option>
              <option value="cancelled">বাতিল</option>
            </select>
            <select
              value={filter.paymentStatus}
              onChange={(e) => setFilter({ ...filter, paymentStatus: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">সকল পেমেন্ট স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="paid">পরিশোধিত</option>
              <option value="failed">ব্যর্থ</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <span className="font-semibold">{selectedOrders.length}</span> টি অর্ডার সিলেক্ট করা হয়েছে
            </div>
            <div className="flex gap-2">
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                defaultValue=""
              >
                <option value="" disabled>স্ট্যাটাস আপডেট করুন</option>
                <option value="confirmed">কনফার্মড</option>
                <option value="processing">প্রক্রিয়াকরণে</option>
                <option value="shipped">পাঠানো হয়েছে</option>
                <option value="delivered">ডেলিভারি সম্পন্ন</option>
                <option value="cancelled">বাতিল</option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                ডিলিট করুন
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    অর্ডার আইডি
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    গ্রাহক
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মোট মূল্য
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    পেমেন্ট
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    তারিখ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                      <p className="mt-2 text-gray-500">লোড হচ্ছে...</p>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      কোনো অর্ডার পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {order.orderId}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{taka(order.total)}</div>
                        <div className="text-xs text-gray-500">{order.items.length} টি আইটেম</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                          {order.paymentStatus === "paid" ? "পরিশোধিত" : order.paymentStatus === "pending" ? "অপেক্ষমান" : "ব্যর্থ"}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.paymentMethod === "cash_on_delivery" ? "ক্যাশ অন ডেলিভারি" : "অনলাইন"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusBadgeColor(order.orderStatus)}`}
                        >
                          <option value="pending">বিবেচনাধীন</option>
                          <option value="confirmed">কনফার্মড</option>
                          <option value="processing">প্রক্রিয়াকরণে</option>
                          <option value="shipped">পাঠানো হয়েছে</option>
                          <option value="delivered">ডেলিভারি সম্পন্ন</option>
                          <option value="cancelled">বাতিল</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <button
                          onClick={() => handleStatusChange(order._id, "cancelled")}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  দেখাচ্ছে <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> থেকে{" "}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{" "}
                  মোট <span className="font-medium">{pagination.total}</span> টি অর্ডার
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    আগের পেজ
                  </button>
                  <span className="px-3 py-1 text-sm">
                    পেজ {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    পরের পেজ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}