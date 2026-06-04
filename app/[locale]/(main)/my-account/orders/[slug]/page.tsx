import { getOrderByOrderId } from "@/queries/orders";
import OrderDetailPageSet from "./PageSet";
import Link from "next/link";
import { auth } from "@/auth";

const OrderDetailPage = async ({ params }: { params: Promise<{ orderId: string }> | { orderId: string } }) => {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.orderId || resolvedParams.slug;
    
    console.log("Fetching order with ID:", orderId);
    
    const session = await auth();
    
    if (!session?.user?.id) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Unauthorized</h2>
            <p className="text-gray-600 mb-4">Please login to view order details.</p>
            <Link
              href="/admin/login"
              className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Login
            </Link>
          </div>
        </div>
      );
    }
    
    const order = await getOrderByOrderId(orderId);
    
    console.log("Order fetched:", order ? "Found" : "Not found");
    
    if (!order) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
            <Link
              href="/my-account/orders"
              className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      );
    }
    
    const orderUserId = order.userId || order.user_id || order.customerId;
    if (orderUserId?.toString() !== session.user.id) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to view this order.</p>
            <Link
              href="/my-account/orders"
              className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      );
    }
    
    return <OrderDetailPageSet order={order} />;
    
  } catch (error) {
    console.error("Error in OrderDetailPage:", error);
    
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load order details"}
          </p>
          <Link
            href="/my-account/orders"
            className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
};

export default OrderDetailPage;