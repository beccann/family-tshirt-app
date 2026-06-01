import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});

export default async function handler(req, res) {
  try {
    const { name, email, shirts, total, successUrl, cancelUrl } = req.body;

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
            unit_amount: Math.round(total * 100)
          },
          quantity: 1
        }
      ],

      metadata: {
        name: name,
        email: email
      },

      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error.message);

    res.status(500).json({
      error: error.message || "Checkout failed"
    });
  }
}
