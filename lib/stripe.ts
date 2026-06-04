// app/lib/stripe.ts
import "server-only";
import Stripe from "stripe";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
    // apiVersion:"2025-04-30.basil",
    apiVersion: "2024-12-18.acacia",
    appInfo:{
        name: "Thikthak-stripe-payment",
        version: "1.0.0"
    }
})