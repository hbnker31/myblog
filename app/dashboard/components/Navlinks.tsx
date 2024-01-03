"use client";
import { cn } from "@/lib/utils";
import { PersonIcon, ReaderIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Navlinks() {
    const pathname = usePathname();
    const links = [
        {
            href: "/dashboard",
            text: "dashboard",
            Icon: ReaderIcon
        },
        {
            href: "/dashboard/user",
            text: "user",
            Icon: PersonIcon
        }
    ];
    return (
        <div className="flex items-center border-b pb-2 gap-5">
            {links.map(({ href, text, Icon }, index) => {
                return (
                    <Link
                        href={href}
                        key={index}
                        className={cn("flex items-center gap-1 hover:underline transition-all", { "text-slate-500": pathname === href })}
                    >
                        <Icon />/{text}
                    </Link>
                );
            })}
        </div>
    );
}
