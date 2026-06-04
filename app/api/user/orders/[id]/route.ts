// app/api/user/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "@/models/user-model";
import { Order } from "@/models/order-model";
import { auth } from "@/auth";

// GET - Fetch a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const order = await Order.findById(params.id)
      .populate('items.product')
      .populate('shipping_address')
      .populate('billing_address');

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order belongs to the user
    if (order.user_id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { order },
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user_id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Permission denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, action } = body;

    // Handle order cancellation
    if (action === "cancel") {
      if (order.status !== "pending" && order.status !== "confirmed") {
        return NextResponse.json(
          { success: false, message: "This order cannot be cancelled" },
          { status: 400 }
        );
      }

      order.status = "cancelled";
      await order.save();

      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully",
        data: { order },
      });
    }

    // Update order status
    if (status) {
      order.status = status;
      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: { order },
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user_id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Permission denied" },
        { status: 403 }
      );
    }

    // Only allow deletion of cancelled or pending orders
    if (order.status !== "pending" && order.status !== "cancelled") {
      return NextResponse.json(
        { success: false, message: "Cannot delete this order" },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}