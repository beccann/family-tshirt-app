import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method allowed is POST only");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16"
  });

  try {
    const { email, total } = req.body;

    const amount = Math.round(Number(total) * 100);

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

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("REAL STRIPE ERROR:", error);

    // ✅ THIS IS THE DIFFERENCE
    return res.status(500).json({
      message: error.message
    });
  }
}
``
