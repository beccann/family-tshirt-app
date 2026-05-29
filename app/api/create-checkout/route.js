import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const data = await req.json();

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
        name: data.name || "",
        email: data.email || "",
        size: data.size || "",
        type: data.type || "",
        tall: data.isTall ? "Yes" : "No",
        personalizationName: data.personalizationName || "",
        personalizationNumber: data.personalizationNumber || "",
        personalizationWings: data.personalizationWings ? "Yes" : "No",
        quantity: (data.quantity || 1).toString()
      },

      success_url: data.successUrl,
      cancel_url: data.cancelUrl
    });

    return Response.json({ url: session.url });

  } catch (error) {
    console.error(error);
    return new Response("Error creating checkout", { status: 500 });
  }
}
