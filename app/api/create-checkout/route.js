import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const data = await req.json();

    const amount = Math.round(Number(data.total) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      metadata: {
        name: data.name || "",
        email: data.email || "",
        shirts: JSON.stringify(data.shirts || [])
      },

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Campout T-Shirt Order"
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],

      customer_email: data.email,

      success_url: data.successUrl,
      cancel_url: data.cancelUrl
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200
    });

  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}
``
