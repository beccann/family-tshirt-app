import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const data = await req.json();

    const amount = Math.round(Number(data.total) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_email: data.email,

      metadata: {
        name: data.name,
        email: data.email,
        shirts: JSON.stringify(data.shirts),
        total: String(data.total)
      },

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Cooper Campout T-Shirt Order"
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],

      success_url: data.successUrl,
      cancel_url: data.cancelUrl
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}
``
