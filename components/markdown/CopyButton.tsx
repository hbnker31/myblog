"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { BsCopy } from "react-icons/bs";
import { IoCheckmarkOutline } from "react-icons/io5";

export default function CopyButton({ id }: { id: string }) {
    const [onCopy, setOnCopy] = useState(false);
    const [onDone, setOnDone] = useState(false);
    const handleCopy = async () => {
        console.log(id);

        const text = document.getElementById(id)?.textContent;
        console.log(text);

        try {
            await navigator.clipboard.writeText(text!);
            setOnCopy(true);
        } catch {
            console.log("copy error");
        }
    };
    return (
        <div onClick={handleCopy} className="p-2 hover:scale-105 cursor-pointer hover:bg-slate-700 rounded-md relative">
            <IoCheckmarkOutline className={cn("cursor-pointer w-5 h-5 text-green-500 transition-all", onDone ? "scale-100" : "scale-0")} />
            <div className="h-full w-full absolute top-0 left-0 flex items-center justify-center">
                <BsCopy
                    className={cn("transition-all", onCopy ? "scale-0" : "scale-100")}
                    onTransitionEnd={() => {
                        if (onCopy) {
                            setOnDone(true);
                        }
                    }}
                />
            </div>
        </div>
    );
}
