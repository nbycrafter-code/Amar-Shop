// app/api/admin/orders/statistics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrderStatistics } from "@/queries/orders";

export async function GET(request: NextRequest) {
  try {
    const statistics = await getOrderStatistics();
    
    return NextResponse.json(
      { success: true, statistics },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}