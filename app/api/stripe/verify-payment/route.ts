// app/api/stripe/verify-payment/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { Order } from "@/models/order-model";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { sessionId, orderId } = await request.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve Stripe session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (checkoutSession.payment_status === "paid") {
      // Update order status
      await Order.findOneAndUpdate(
        { orderId: orderId },
        {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          paymentIntentId: checkoutSession.payment_intent,
          stripeSessionId: sessionId,
        }
      );

      return NextResponse.json({
        success: true,
        orderId: orderId,
      });
    }

    return NextResponse.json({
      error: "payment_not_completed",
      message: "Payment was not completed",
    }, { status: 400 });

  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({
      error: "verification_failed",
      message: error.message,
    }, { status: 500 });
  }
}