import { readFile, writeFile } from "@/utils/fileDB";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let stripeEvent;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return new Response("Webhook error", { status: 400 });
    }

    if (stripeEvent.type === "checkout.session.completed") {
        const session = stripeEvent.data.object;
        const { metadata } = session;
        const { userId, ...rest } = metadata;

        const users = readFile("users");
        
        const updatedUsers = (users || []).map((u) => {
            if (u?.id == metadata?.userId) {
                return {
                    ...u,
                    currentActivePlan: rest
                }
            }

            return u;
        })

        writeFile("users", updatedUsers);
    }

    return new Response("OK");
}