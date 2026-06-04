// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createOrderQuery, getAllOrders, getOrdersByPhone, getOrdersByUserId } from "@/queries/orders";
import { auth } from "@/auth";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import mongoose from "mongoose";

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { session, customerName, customerAddress, customerPhone, items, subtotal, total } = body;

    if (!customerName || !customerAddress || !customerPhone) {
      return NextResponse.json(
        { error: "Name, address, and phone are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    if (!subtotal || !total) {
      return NextResponse.json(
        { error: "Subtotal and total are required" },
        { status: 400 }
      );
    }

    // ✅ Debug: Check session user ID
    console.log("Session user:", {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });

    // ✅ Get user ID properly
    let userId;
    try {
      // Try to convert to ObjectId
      userId = new mongoose.Types.ObjectId(session.user.id);
    } catch (error) {
      // If it's already a string, use as is
      userId = session.user.id;
    }

    const orderData = {
      customerId: session.user.id, // ✅ Add customerId
      customerEmail: session.user.email, // ✅ Add customerEmail
      customerName,
      customerAddress,
      customerPhone,
      items: items.map((item: any) => ({
        ...item,
        image: item.image || null, // Ensure image is included
      })),
      subtotal,
      deliveryCharge: body.deliveryCharge || 0,
      total,
      paymentMethod: body.paymentMethod || "cash_on_delivery",
      paymentStatus: "pending",
      orderStatus: "pending",
      specialInstructions: body.specialInstructions || null,
      userId: userId, // ✅ Use the properly formatted ID
    };

    console.log("Order data being saved:", {
      userId: orderData.userId,
      customerId: orderData.customerId,
      customerEmail: orderData.customerEmail
    });

    const order = await createOrderQuery(orderData);

    // ✅ Send email in background (don't await)
    sendOrderConfirmationEmail({
      to: session.user.email,
      orderId: order.orderId,
      customerName: customerName,
      total: total,
      items: items.map((item: any) => ({
        name: item.name,
        slug: item.slug,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        selectedColorBn: item.selectedColorBn,
        selectedColorHex: item.selectedColorHex,
        image: item.image, // ✅ Include image
      })),
      address: customerAddress,
      phone: customerPhone,
      paymentMethod: orderData.paymentMethod,
    }).then(result => {
      if (result.success) {
        console.log("✅ Email sent to:", session.user.email);
      } else {
        console.error("❌ Failed to send email:", result.error);
      }
    }).catch(error => {
      console.error("❌ Email sending error:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: {
          orderId: order.orderId,
          id: order._id,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET - Get all orders (admin only) or user orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const userId = searchParams.get("userId");

    let orders;
    
    if (phone) {
      // Get orders by phone number
      orders = await getOrdersByPhone(phone);
    } else if (userId) {
      // Get orders by user ID
      orders = await getOrdersByUserId(userId);
    } else {
      // Get all orders (admin only)
      if (session?.user?.role !== "admin") {
        return NextResponse.json(
          { error: "Unauthorized. Admin access required." },
          { status: 403 }
        );
      }
      orders = await getAllOrders();
    }

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 }
    );
  }
}