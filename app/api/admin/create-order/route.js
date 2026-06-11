import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // 🔐 Admin protection
    const adminKey = req.headers.get("x-admin-key");

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const data = await req.json();

    const { name, email, shirts, total } = data;

    // ✅ Basic validation (prevents bad data)
    if (!name || !email || !shirts || !total) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const amount = Math.round(Number(total) * 100);

    // ✅ SAFE: Create PaymentIntent WITHOUT confirming
    // No risk of Stripe rejecting
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",

      metadata: {
        name,
        email,
        shirts: JSON.stringify(shirts),
        total: String(total),

        // ✅ KEY FLAGS (super helpful later)
        paymentType: "offline",
        source: "admin_manual",
        note: "Late order added manually after deadline"
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        stripeId: intent.id
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("ADMIN ORDER ERROR:", error);

    return new Response(
      JSON.stringify({
        error: "Something went wrong",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
