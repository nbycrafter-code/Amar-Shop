// app/queries/orders.ts
import { Order, OrderItem } from "@/models/order-model";

// Types
export interface OrderData {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge?: number;
  total: number;
  paymentMethod?: string;
  specialInstructions?: string;
}

export interface OrderResponse {
  _id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generate unique order ID
function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}${hours}${minutes}${seconds}-${random}`;
}

// Create new order
// app/queries/orders.ts (partial - updated createOrderQuery)
export async function createOrderQuery(orderData: any): Promise<OrderResponse> {
  try {
    // ✅ Validate required fields including customerId and customerEmail
    if (!orderData.customerName || !orderData.customerAddress || !orderData.customerPhone) {
      throw new Error("Customer name, address, and phone are required");
    }

    if (!orderData.customerId) {
      throw new Error("Customer ID is required");
    }

    if (!orderData.customerEmail) {
      throw new Error("Customer email is required");
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("At least one item is required");
    }

    // Generate unique order ID
    let orderId = generateOrderId();
    let existingOrder = await Order.findOne({ orderId });
    let attempts = 0;
    const maxAttempts = 5;

    while (existingOrder && attempts < maxAttempts) {
      orderId = generateOrderId();
      existingOrder = await Order.findOne({ orderId });
      attempts++;
    }

    if (existingOrder) {
      throw new Error("Failed to generate unique order ID");
    }

    // ✅ Create order with all fields
    const order = new Order({
      orderId,
      customerId: orderData.customerId,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerAddress: orderData.customerAddress,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || "cash_on_delivery",
      paymentStatus: orderData.paymentStatus || "pending",
      orderStatus: orderData.orderStatus || "pending",
      specialInstructions: orderData.specialInstructions || null,
      userId: orderData.userId || orderData.customerId,
    });

    const savedOrder = await order.save();
    const orderObject = savedOrder.toObject();

    return {
      ...orderObject,
      _id: orderObject._id.toString(),
      customerId: orderObject.customerId?.toString(),
      userId: orderObject.userId?.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create order");
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<OrderResponse | null> {
  try {
    const order = await Order.findById(orderId).lean();
    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get order");
  }
}

// Get order by order number
export async function getOrderByOrderId(orderId: string): Promise<OrderResponse | null> {
  try {
    const order = await Order.findOne({ orderId }).lean();
    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get order");
  }
}

// Get all orders (for admin)
export async function getAllOrders(filter: any = {}): Promise<OrderResponse[]> {
  try {
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return orders.map(order => ({
      ...order,
      _id: order._id.toString(),
    })) as OrderResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get orders");
  }
}

// Get orders by phone number
export async function getOrdersByPhone(phone: string): Promise<OrderResponse[]> {
  try {
    const orders = await Order.find({ customerPhone: phone }).sort({ createdAt: -1 }).lean();
    return orders.map(order => ({
      ...order,
      _id: order._id.toString(),
    })) as OrderResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get orders");
  }
}

export async function getOrdersByUserId(userId: string) {
  const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
  return orders.map(order => ({
    ...order,
    _id: order._id.toString(),
  })) as OrderResponse[];
}

// Update order status
export async function updateOrderStatusQuery(
  orderId: string,
  orderStatus: string
): Promise<OrderResponse | null> {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update order status");
  }
}

// Update payment status
export async function updatePaymentStatusQuery(
  orderId: string,
  paymentStatus: string
): Promise<OrderResponse | null> {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update payment status");
  }
}

// Cancel order
export async function cancelOrderQuery(orderId: string): Promise<OrderResponse | null> {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: "cancelled", updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to cancel order");
  }
}

// Delete order (admin only)
export async function deleteOrderQuery(orderId: string): Promise<boolean> {
  try {
    const result = await Order.findByIdAndDelete(orderId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete order");
  }
}

// Get all orders with pagination and filters (for admin)
export async function getAllOrdersAdmin(filter: any = {}, page: number = 1, limit: number = 10): Promise<{ orders: OrderResponse[], total: number, page: number, totalPages: number }> {
  try {
    const skip = (page - 1) * limit;

    const query: any = {};

    // Apply filters
    if (filter.orderStatus) {
      query.orderStatus = filter.orderStatus;
    }
    if (filter.paymentStatus) {
      query.paymentStatus = filter.paymentStatus;
    }
    if (filter.search) {
      query.$or = [
        { orderId: { $regex: filter.search, $options: 'i' } },
        { customerName: { $regex: filter.search, $options: 'i' } },
        { customerPhone: { $regex: filter.search, $options: 'i' } }
      ];
    }
    if (filter.startDate && filter.endDate) {
      query.createdAt = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate)
      };
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    const formattedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
    })) as OrderResponse[];

    return {
      orders: formattedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get orders");
  }
}

// Get order statistics for admin dashboard
export async function getOrderStatistics(): Promise<OrderStatistics> {
  try {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders,
      thisWeekOrders,
      thisMonthOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "confirmed" }),
      Order.countDocuments({ orderStatus: "processing" }),
      Order.countDocuments({ orderStatus: "shipped" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
      Order.aggregate([
        { $match: { orderStatus: "delivered", paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
      }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      })
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      thisWeekOrders,
      thisMonthOrders
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get order statistics");
  }
}

// Get all orders for a specific user
export async function getUserOrders(userId: string) {
  try {
    const orders = await Order.find({ user_id: userId })
      .populate('items.product')
      .populate('shipping_address')
      .populate('billing_address')
      .sort({ created_at: -1 });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

// Get order with timeline
export async function getOrderStatusWithTimeline(orderId: string) {
  try {
    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('shipping_address')
      .populate('billing_address');

    if (!order) {
      return null;
    }

    // Build timeline from order status and history
    const timeline = [];

    // Order placed
    timeline.push({
      status: "ORDER_PLACED",
      timestamp: order.created_at,
      description: "Order has been placed successfully",
      icon: "🛒",
    });

    // Order confirmed
    if (order.status === "confirmed" || order.status === "processing" ||
      order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "CONFIRMED",
        timestamp: order.confirmed_at || order.updated_at,
        description: "Order has been confirmed",
        icon: "✅",
      });
    }

    // Processing
    if (order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "PROCESSING",
        timestamp: order.processing_at || order.updated_at,
        description: "Order is being processed",
        icon: "⚙️",
      });
    }

    // Shipped
    if (order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "SHIPPED",
        timestamp: order.shipped_at || order.updated_at,
        description: `Order has been shipped${order.tracking_number ? ` with tracking #${order.tracking_number}` : ''}`,
        icon: "🚚",
      });
    }

    // Out for delivery
    if (order.status === "out_for_delivery" || order.status === "delivered") {
      timeline.push({
        status: "OUT_FOR_DELIVERY",
        timestamp: order.out_for_delivery_at || order.updated_at,
        description: "Order is out for delivery",
        icon: "📦",
      });
    }

    // Delivered
    if (order.status === "delivered") {
      timeline.push({
        status: "DELIVERED",
        timestamp: order.delivered_at || order.updated_at,
        description: "Order has been delivered successfully",
        icon: "🎉",
      });
    }

    // Cancelled
    if (order.status === "cancelled") {
      timeline.push({
        status: "CANCELLED",
        timestamp: order.cancelled_at || order.updated_at,
        description: order.cancel_reason || "Order has been cancelled",
        icon: "❌",
      });
    }

    return {
      currentStatus: order.status,
      timeline,
      estimatedDelivery: order.estimated_delivery,
      trackingNumber: order.tracking_number,
      trackingUrl: order.tracking_url,
    };
  } catch (error) {
    console.error("Error fetching order timeline:", error);
    return null;
  }
}

// Update order (admin)
export async function updateOrderAdmin(orderId: string, updateData: Partial<OrderData>): Promise<OrderResponse | null> {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update order");
  }
}

// Bulk update order status
export async function bulkUpdateOrderStatus(orderIds: string[], orderStatus: string): Promise<number> {
  try {
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { orderStatus, updatedAt: new Date() }
    );
    return result.modifiedCount;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to bulk update orders");
  }
}

// Bulk delete orders
export async function bulkDeleteOrders(orderIds: string[]): Promise<number> {
  try {
    const result = await Order.deleteMany({ _id: { $in: orderIds } });
    return result.deletedCount;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete orders");
  }
}

// Track order by order ID
export async function trackOrderByOrderId(orderId: string): Promise<OrderResponse | null> {
  try {
    const order = await Order.findOne({ orderId }).lean();
    if (!order) return null;

    return {
      ...order,
      _id: order._id.toString(),
    } as OrderResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to track order");
  }
}

// Get orders by phone number (for customer tracking)
export async function getOrdersByPhoneNumber(phone: string): Promise<OrderResponse[]> {
  try {
    const orders = await Order.find({
      customerPhone: { $regex: phone, $options: 'i' }
    }).sort({ createdAt: -1 }).lean();

    return orders.map(order => ({
      ...order,
      _id: order._id.toString(),
    })) as OrderResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get orders");
  }
}

export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}