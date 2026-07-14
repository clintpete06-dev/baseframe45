/**
 * Paystack client-side helper
 * Uses @paystack/inline-js for popup-based checkout
 */

import PaystackPop from "@paystack/inline-js";

export interface PaystackTransaction {
  reference: string;
  status: string;
  trans: string;
  message: string;
  channel: string;
  domain: string;
  amount: number;
  currency: string;
  customer: { email: string; phone: string };
}

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;

/**
 * Initialize and open Paystack popup checkout.
 * Returns the verified transaction on success.
 */
export function openPaystackCheckout(params: {
  email: string;
  amount: number;
  currency?: string;
  userId: string;
  cartItems: { name: string; quantity: number; price: number }[];
  onSuccess: (transaction: PaystackTransaction) => void;
  onClose: () => void;
}) {
  const pop = new PaystackPop();
  pop.newTransaction({
    key: PAYSTACK_PUBLIC_KEY,
    email: params.email,
    amount: params.amount * 100,
    currency: params.currency || "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "User ID",
          variable_name: "userId",
          value: params.userId,
        },
        {
          display_name: "Cart Items",
          variable_name: "cartItems",
          value: JSON.stringify(params.cartItems.map((i) => `${i.name} x${i.quantity}`)),
        },
      ],
    },
    onSuccess(transaction: PaystackTransaction) {
      params.onSuccess(transaction);
    },
    onClose() {
      params.onClose();
    },
  });
}

/**
 * Initialize a server-side transaction via Convex HTTP action.
 */
export async function initPaystackServerTransaction(params: {
  userId: string;
  email: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<PaystackInitResponse> {
  const res = await fetch(`${CONVEX_URL}/api/paystack/initializeTransaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to initialize Paystack transaction");
  }

  return res.json();
}
