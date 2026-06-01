import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { name, email, shirts, total, successUrl, cancelUrl } = req.body;

    // ✅ Just log the order so you don't lose it
    console.log("ORDER:", {
      name,
      email,
      shirts,
      total
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Campout T-Shirt Order"
            },
            unit_amount: total * 100
          },
          quantity: 1
        }
      ],

      // ✅ IMPORTANT: SMALL metadata only (this fixes your crash)
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
  console.error("FULL ERROR:", error);

  res.status(500).json({
    error: error.message
  });
}
