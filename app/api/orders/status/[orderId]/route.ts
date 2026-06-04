// app/api/orders/status/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrderStatusWithTimeline } from "@/queries/orders";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {    
    const statusData = await getOrderStatusWithTimeline(params.orderId);
    
    if (!statusData) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: statusData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch order status" },
      { status: 500 }
    );
  }
}