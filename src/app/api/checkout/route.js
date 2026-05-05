import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    const body = await request.json();
    const { id, name, price, userId } = body;

    if (!price) {
        return Response.json(
            { error: "Price is Required", status: 400 },
        )
    }

    if (!userId) {
        return Response.json(
            { error: "User ID is Required", status: 400 },
        );
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: name || "Chat Premium",
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId: userId,
            planId: id,
            planName: name,
            planPrice: price,
        },
        custom_text: {
            submit: {
                message: "Thank you for your purchase!"
            }
        },
        success_url: "http://localhost:3000/chat",
        cancel_url: "http://localhost:3000/plans",
    });

    return Response.json({ url: session.url });
}