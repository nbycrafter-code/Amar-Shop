// app/api/orders/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { trackOrderByOrderId, getOrdersByPhoneNumber } from "@/queries/orders";

export async function GET(request: NextRequest) {
  try {    
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");
    
    // Track by order ID
    if (orderId) {
      const order = await trackOrderByOrderId(orderId);
      
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: true, order },
        { status: 200 }
      );
    }
    
    // Track by phone number
    if (phone) {
      const orders = await getOrdersByPhoneNumber(phone);
      
      return NextResponse.json(
        { success: true, orders },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: "Order ID or phone number is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to track order" },
      { status: 500 }
    );
  }
}