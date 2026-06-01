import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const amount = Math.round(Number(body.total) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_payment_methods: { enabled: true },

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

      customer_email: body.email,

      success_url: "https://family-tshirt-app.vercel.app/success",
      cancel_url: "https://family-tshirt-app.vercel.app"
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200
    });

  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    });
  }
}
