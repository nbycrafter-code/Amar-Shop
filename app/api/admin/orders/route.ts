// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllOrdersAdmin, bulkUpdateOrderStatus, bulkDeleteOrders } from "@/queries/orders";

export async function GET(request: NextRequest) {
  try {    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const orderStatus = searchParams.get("orderStatus") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    
    const filter: any = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) filter.search = search;
    if (startDate && endDate) {
      filter.startDate = startDate;
      filter.endDate = endDate;
    }
    
    const result = await getAllOrdersAdmin(filter, page, limit);
    
    return NextResponse.json(
      { success: true, ...result },
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderIds, orderStatus } = body;
    
    if (!orderIds || !orderIds.length) {
      return NextResponse.json(
        { error: "Order IDs are required" },
        { status: 400 }
      );
    }
    
    if (!orderStatus) {
      return NextResponse.json(
        { error: "Order status is required" },
        { status: 400 }
      );
    }
    
    const updatedCount = await bulkUpdateOrderStatus(orderIds, orderStatus);
    
    return NextResponse.json(
      { success: true, message: `${updatedCount} orders updated successfully`, updatedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating orders:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update orders" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderIds } = body;
    
    if (!orderIds || !orderIds.length) {
      return NextResponse.json(
        { error: "Order IDs are required" },
        { status: 400 }
      );
    }
    
    const deletedCount = await bulkDeleteOrders(orderIds);
    
    return NextResponse.json(
      { success: true, message: `${deletedCount} orders deleted successfully`, deletedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting orders:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete orders" },
      { status: 500 }
    );
  }
}