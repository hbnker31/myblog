import { createSupabaseAdmin } from "@/lib/supabase";
import { log } from "console";
import { headers } from "next/headers";
import { buffer } from "stream/consumers";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SK_KEY!);
const endpointSecret = process.env.NEXT_PUBLIC_STRIPE_ENDPOINT_KEY!;

export async function POST(request: any) {
    const rawBody = await buffer(request.body);

    let event;

    try {
        const sig = headers().get("stripe-signature");
        event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
    } catch (err: any) {
        console.log(err);

        return Response.json({ error: `Webhook error ${err?.message}` });
    }

    // Handle the event

    switch (event.type) {
        case "customer.updated":
            const customer = event.data.object;
            const subscription = await stripe.subscriptions.list({
                customer: customer.id
            });
            if (subscription.data.length) {
                const sub = subscription.data[0];

                //call to supabase
                const { error } = await onSuccessSubscription(sub.status === "active", sub.id, customer.id, customer.email!);
                if (error?.message) {
                    return Response.json({ error: error.message });
                }
            }
            break;
        case "customer.subscription.deleted":
            const deleteSub = event.data.object;
            const { error } = await onCancelSubscription(false, deleteSub.id);
            if (error?.message) {
                return Response.json({
                    error: `Faield to cancel subscription. ${error.message}`
                });
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    return Response.json({});
}

const onCancelSubscription = async (subscription_status: boolean, sub_id: string) => {
    const supabaseAdmin = await createSupabaseAdmin();

    return await supabaseAdmin
        .from("users")
        .update({
            subscription_status,
            stripe_subscription_id: null,
            stripe_customer_id: null
        })
        .eq("stripe_subscription_id", sub_id);
};

const onSuccessSubscription = async (subscription_status: boolean, stripe_subscription_id: string, stripe_customer_id: string, email: string) => {
    console.log("please update");

    const supabaseAdmin = await createSupabaseAdmin();

    return await supabaseAdmin
        .from("users")
        .update({
            subscription_status,
            stripe_subscription_id,
            stripe_customer_id
        })
        .eq("email", email);
};
