// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatusQuery, cancelOrderQuery, deleteOrderQuery } from "@/queries/orders";

// GET - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const order = await getOrderById(params.id);
    
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
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const body = await request.json();
    const { orderStatus, paymentStatus } = body;
    
    let updatedOrder = null;
    
    if (orderStatus) {
      updatedOrder = await updateOrderStatusQuery(params.id, orderStatus);
    } else if (paymentStatus) {
      const { updatePaymentStatusQuery } = await import("@/queries/orders");
      updatedOrder = await updatePaymentStatusQuery(params.id, paymentStatus);
    }
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found or update failed" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: "Order updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");
    
    let result;
    if (action === "cancel") {
      result = await cancelOrderQuery(params.id);
    } else {
      result = await deleteOrderQuery(params.id);
    }
    
    if (!result) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: action === "cancel" ? "Order cancelled successfully" : "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process order" },
      { status: 500 }
    );
  }
}