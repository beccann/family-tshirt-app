import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Family Reunion T-Shirt",
            },
            unit_amount: Math.round(data.total * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        name: data.name,
        email: data.email,
        size: data.size,
        type: data.type,
        tall: data.isTall ? "Yes" : "No",
        personalizationName: data.personalizationName || "",
        personalizationNumber: data.personalizationNumber || "",
        personalizationWings: data.personalizationWings ? "Yes" : "No",
        quantity: data.quantity.toString()
      },

      success_url: data.successUrl,
      cancel_url: data.cancelUrl
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
}