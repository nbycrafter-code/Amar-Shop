import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/models/user-model";
import { Order } from "@/models/order-model";
import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";

// GET - Fetch all orders for the authenticated user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the current user session
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized. Please login to view your orders." 
        },
        { status: 401 }
      );
    }

    // Find the user in database
    const user = await User.findOne({ email: session.user.email })
      .select('_id name email');

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User not found in database." 
        },
        { status: 404 }
      );
    }

    // Get query parameters for filtering, pagination, etc.
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // ✅ FIXED: Build query with correct field name
    let query: any = { 
      $or: [
        { userId: user._id },
        { user_id: user._id },
        { customerId: user._id }
      ]
    };
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    console.log("Query:", JSON.stringify(query, null, 2));

    // ✅ FIXED: Fetch orders from database with correct field names
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`Found ${orders.length} orders`);

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);

    // ✅ FIXED: Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderId: order.orderId,
      order_number: order.order_number || order.orderId,
      created_at: order.createdAt || order.created_at,
      status: order.orderStatus || order.status,
      total_amount: order.total,
      items_count: order.items?.length || 0,
      payment_method: order.paymentMethod,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: order.items?.map((item: any) => ({
        id: item._id,
        productId: item.productId,
        name: item.name,
        nameBn: item.nameBn,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.image,
      })),
    }));

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders: formattedOrders,
        pagination: {
          current_page: page,
          per_page: limit,
          total: totalOrders,
          total_pages: Math.ceil(totalOrders / limit),
        }
      }
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while fetching your orders. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the current user session
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { items, shipping_address_id, billing_address_id, payment_method, shipping_method, customerName, customerAddress, customerPhone } = body;

    // Validate required fields
    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, message: "No items in order" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Calculate total amount
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id || item.productId);

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.product_id || item.productId} not found` },
          { status: 404 }
        );
      }

      const itemTotal = product.price * item.quantity;
      total_amount += itemTotal;

      orderItems.push({
        productId: product._id,
        product_id: product._id,
        name: product.name,
        nameBn: product.nameBn || product.name,
        quantity: item.quantity,
        price: product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: product.images?.[0] || product.image,
      });
    }

    // Generate unique order number
    const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderId = order_number;

    // ✅ FIXED: Create the order with correct field names
    const order = await Order.create({
      orderId: orderId,
      order_number: order_number,
      userId: user._id,
      user_id: user._id,
      customerId: user._id,
      customerEmail: session.user.email,
      customerName: customerName || user.name,
      customerAddress: customerAddress,
      customerPhone: customerPhone,
      total: total_amount,
      total_amount: total_amount,
      subtotal: total_amount,
      status: 'pending',
      orderStatus: 'pending',
      paymentStatus: 'pending',
      payment_method: payment_method || 'cash_on_delivery',
      paymentMethod: payment_method || 'cash_on_delivery',
      shipping_method: shipping_method,
      shipping_address_id: shipping_address_id,
      billing_address_id: billing_address_id,
      items: orderItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Order created successfully:", order.orderId);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      data: {
        order: {
          id: order._id,
          orderId: order.orderId,
          order_number: order.order_number,
        },
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { order_id, action } = body;

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ 
      $or: [
        { _id: order_id },
        { orderId: order_id },
        { order_number: order_id }
      ]
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns the order
    const user = await User.findOne({ email: session.user.email });

    const orderUserId = order.userId || order.user_id || order.customerId;
    
    if (orderUserId?.toString() !== user?._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to modify this order" },
        { status: 403 }
      );
    }

    let updatedOrder;

    // Handle different actions
    switch (action) {
      case 'cancel':
        const currentStatus = order.orderStatus || order.status;
        if (currentStatus === 'pending' || currentStatus === 'processing') {
          updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            { 
              orderStatus: 'cancelled',
              status: 'cancelled',
              updatedAt: new Date() 
            },
            { new: true }
          );
        } else {
          return NextResponse.json(
            { success: false, message: "This order cannot be cancelled" },
            { status: 400 }
          );
        }
        break;
      
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${action}ed successfully`,
      data: { order: updatedOrder },
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel an order
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ 
      $or: [
        { _id: order_id },
        { orderId: order_id },
        { order_number: order_id }
      ]
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns the order
    const user = await User.findOne({ email: session.user.email });

    const orderUserId = order.userId || order.user_id || order.customerId;
    
    if (orderUserId?.toString() !== user?._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to cancel this order" },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    const currentStatus = order.orderStatus || order.status;
    if (currentStatus !== 'pending' && currentStatus !== 'processing') {
      return NextResponse.json(
        { success: false, message: "This order cannot be cancelled" },
        { status: 400 }
      );
    }

    // Cancel the order
    const cancelledOrder = await Order.findByIdAndUpdate(
      order._id,
      { 
        orderStatus: 'cancelled',
        status: 'cancelled',
        updatedAt: new Date() 
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      data: { order: cancelledOrder },
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel order" },
      { status: 500 }
    );
  }
}