// app/actions/stripe.ts - Final working version
'use server';

import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function createCheckoutSession(orderData: any) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return {
        error: "unauthorized",
        message: "Please login to continue checkout",
      };
    }

    const origin = (await headers()).get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create order
    const orderResponse = await fetch(`${origin}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderData,
        paymentMethod: "stripe",
        paymentStatus: "pending",
        orderStatus: "pending",
        userId: session.user.id,
      }),
    });

    const orderResult = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderResult.error || "Failed to create order");
    }

    // ✅ Prepare line items WITHOUT images to avoid URL issues
    const lineItems = orderData.items.map((item: any) => ({
      quantity: item.quantity,
      price_data: {
        currency: "bdt",
        product_data: {
          name: item.name,
          description: [
            item.selectedSize ? `Size: ${item.selectedSize}` : '',
            item.selectedColor ? `Color: ${item.selectedColor}` : ''
          ].filter(Boolean).join(', ') || undefined,
          // ✅ Remove images completely to fix the URL error
        },
        unit_amount: Math.round(item.price * 100),
      },
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: session.user.email,
      metadata: {
        orderId: orderResult.order.orderId,
        userId: session.user.id,
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderResult.order.orderId}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    });
    if (!checkoutSession.url) {
      throw new Error("Failed to create checkout session");
    }
    return {
      success: true,
      url: checkoutSession.url,
      orderId: orderResult.order.orderId,
    };
    
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return {
      error: "payment_error",
      message: error.message || "Failed to create payment session",
    };
  }
}