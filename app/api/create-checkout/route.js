import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email, total } = await req.json();

    const amount = Math.round(Number(total) * 100);

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      automatic_payment_methods: {
        enabled: true
      },

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

      customer_email: email,

      success_url: "https://family-tshirt-app.vercel.app/success",
      cancel_url: "https://family-tshirt-app.vercel.app"
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Stripe error:", error);

    return new Response(
      JSON.stringify({ error: "Checkout failed" }),
      { status: 500 }
    );
  }
}
