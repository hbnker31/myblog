"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { EyeOpenIcon, Pencil1Icon, RocketIcon, StarIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import { BsSave } from "react-icons/bs";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@/components/markdown/markdownPreview";
import { blogFormSchema, blogFormSchemaType } from "../schema";
import { IBlogDetail } from "@/lib/types";

export default function BlogForm({ onHandleSubmit, blog }: { onHandleSubmit: (data: blogFormSchemaType) => void; blog?: IBlogDetail }) {
    const [isPending, setIsPending] = useTransition();
    const [isPreview, setIsPreview] = useState(false);
    const form = useForm<z.infer<typeof blogFormSchema>>({
        mode: "all",
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: blog?.title || "",
            content: blog?.blog_content?.content || "",
            image_url:
                blog?.image_url ||
                "https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            is_premium: blog?.is_premium || false,
            is_published: blog?.is_published || false
        }
    });

    function onSubmit(data: blogFormSchemaType) {
        setIsPending(() => {
            onHandleSubmit(data);
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full border rounded-md space-y-6 pb-10">
                <div className="flex justify-between flex-wrap p-5 border-b gap-5">
                    <div className="flex gap-5 items-center flex-wrap">
                        <Button
                            type="button"
                            tabIndex={0}
                            onClick={() => setIsPreview((prevState) => !prevState && !form.getFieldState("image_url").invalid)}
                            className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md hover:ring-2 hover:ring-zinc-400 transition-all"
                        >
                            {isPreview ? (
                                <>
                                    <Pencil1Icon /> Edit
                                </>
                            ) : (
                                <>
                                    <EyeOpenIcon /> Preview
                                </>
                            )}
                        </Button>
                        <FormField
                            control={form.control}
                            name="is_premium"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md">
                                            <StarIcon />
                                            <span>Premium</span>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_published"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md">
                                            <RocketIcon />
                                            <span>Publish</span>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={!form.formState.isValid} className="flex items-center gap-1">
                        <BsSave className={cn({ "animate-spin": isPending })} /> Save
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className={cn("w-full p-2 flex break-words gap-2", isPreview ? "divide-x-0" : "divide-x")}>
                                    <Input
                                        placeholder="title"
                                        {...field}
                                        className={cn(
                                            "border-none text-lg text-slate-500 font-medium leading-relaxed",
                                            isPreview ? "w-0 p-0" : "w-full lg:px-10"
                                        )}
                                    />
                                    <div className={cn("lg:px-10", isPreview ? "mx-auto w-full lg:w-4/5" : "w-1/2 lg:block hidden")}>
                                        <h1 className="text-3xl font-medium">{form.getValues().title}</h1>
                                    </div>
                                </div>
                            </FormControl>
                            {form.getFieldState("title").invalid && form.getValues().title && <FormMessage />}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className={cn("w-full p-2 flex break-words gap-2", isPreview ? "divide-x-0" : "divide-x")}>
                                    <Input
                                        placeholder="image_url"
                                        {...field}
                                        className={cn(
                                            "border-none text-lg text-slate-500 font-medium leading-relaxed",
                                            isPreview ? "w-0 p-0" : "w-full lg:px-10"
                                        )}
                                    />
                                    <div className={cn("lg:px-10", isPreview ? "mx-auto w-full lg:w-4/5" : "w-1/2 lg:block hidden")}>
                                        {!isPreview ? (
                                            <>
                                                <p> Click on Preview to see image</p>
                                            </>
                                        ) : (
                                            <div className="relative h-80 mt-5 border rounded-md">
                                                <Image
                                                    src={form.getValues().image_url}
                                                    alt="preview"
                                                    fill
                                                    className="object-cover object-center rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            {form.getFieldState("image_url").invalid && form.getValues().image_url && <FormMessage />}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className={cn("w-full p-2 flex break-words gap-2", isPreview ? "divide-x-0" : "divide-x h-70vh")}>
                                    <Textarea
                                        placeholder="content"
                                        {...field}
                                        className={cn(
                                            "border-none text-lg text-slate-500 font-medium leading-relaxed resize-none h-full",
                                            isPreview ? "w-0 p-0" : "w-full lg:px-10"
                                        )}
                                    />
                                    <div className={cn("overflow-y-auto", isPreview ? "mx-auto w-full lg:w-4/5" : "w-1/2 lg:block hidden")}>
                                        <MarkdownPreview content={form.getValues().content} className="font-medium" />
                                    </div>
                                </div>
                            </FormControl>
                            {form.getFieldState("content").invalid && form.getValues().content && <FormMessage />}
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
