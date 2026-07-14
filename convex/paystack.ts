import { httpAction } from "./_generated/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";
const PAYSTACK_API = "https://api.paystack.co";

export const initializeTransaction = httpAction(async (_ctx, request) => {
  const body = await request.json();
  const userId = body.userId;
  const email = body.email;
  const amount = body.amount;
  const currency = body.currency;
  const metadata = body.metadata;

  const origin = request.headers.get("origin") || "";

  const res = await fetch(PAYSTACK_API + "/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + PAYSTACK_SECRET_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      amount: amount * 100,
      currency: currency || "NGN",
      metadata: Object.assign({ userId: userId }, metadata || {}),
      callback_url: origin + "/#/payment-callback",
    }),
  });

  const data = await res.json();

  if (!data.status) {
    return new Response(JSON.stringify({ error: data.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});

export const verifyTransaction = httpAction(async (ctx, request) => {
  const body = await request.json();
  const reference = body.reference;

  const res = await fetch(PAYSTACK_API + "/transaction/verify/" + reference, {
    headers: {
      Authorization: "Bearer " + PAYSTACK_SECRET_KEY,
    },
  });

  const data = await res.json();

  if (!data.status) {
    return new Response(JSON.stringify({ verified: false, message: data.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tx = data.data;

  if (tx.status === "success") {
    const userId = tx.metadata && tx.metadata.userId ? tx.metadata.userId : "";
    const email = tx.customer && tx.customer.email ? tx.customer.email : "";

    const paymentId = await ctx.runMutation("payments:recordSuccessfulPayment", {
      reference: tx.reference,
      amount: tx.amount / 100,
      currency: tx.currency,
      userId: userId,
      email: email,
      metadata: JSON.stringify(tx.metadata),
    });

    return new Response(
      JSON.stringify({ verified: true, orderId: paymentId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ verified: false, status: tx.status }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
