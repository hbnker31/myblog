import React, { useEffect, useTransition } from "react";
import { Button } from "../ui/button";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useUser } from "@/lib/store/user";
import LoginForm from "../nav/LoginForm";
import { usePathname } from "next/navigation";
import { checkout } from "@/lib/actions/stripe";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";

export default function Checkout() {
    const pathname = usePathname();
    const [isPending, setIsPending] = useTransition();
    const user = useUser((state) => state.user);
    useEffect(() => {
        console.log("sadfjhwejf");
        const data = fetch("https://animechan.xyz/api/random/anime?title=naruto")
            .then((response) => response.json())
            .then((quote) => console.log(quote));
        console.log(data);
    }, []);
    const handleCheckout = (e: any) => {
        e.preventDefault();
        setIsPending(async () => {
            const data = JSON.parse(await checkout(user?.email!, location.origin + pathname));
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
            await stripe?.redirectToCheckout({ sessionId: data.id });
        });
    };

    if (!user?.id) {
        return (
            <div className="flex items-center h-96 w-full justify-center gap-2">
                <LoginForm /> to read
            </div>
        );
    }
    return (
        <form className={cn("h96 w-full flex items-center justify-normal", { "animate-pulse": isPending })} onSubmit={handleCheckout}>
            <Button variant="ghost" className="flex flex-col p-10 gap-5 ring ring-green-500">
                <span className="flex items-center gap-2 text-2xl font-blod text-green-500">
                    <LightningBoltIcon className={cn("h-5 w-5", !isPending ? "animate-bounce" : "animate-spin")} /> Upgrade to Premium
                </span>
                <span>Unlock all blog contents</span>
            </Button>
        </form>
    );
}
