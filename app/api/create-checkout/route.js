import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { email, total } = req.body;

    // ✅ MAKE SURE TOTAL IS VALID
    const amount = Math.round(Number(total || 0) * 100);

    if (!amount || amount < 50) {
      return res.status(400).json({
        error: "Invalid amount"
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

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

      customer_email: email,

      success_url: "https://family-tshirt-app.vercel.app/success",
      cancel_url: "https://family-tshirt-app.vercel.app"
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Stripe failed"
    });
  }
}
