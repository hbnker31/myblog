"use client";

import BlogForm from "@/app/dashboard/components/BlogForm";
import { blogFormSchemaType } from "@/app/dashboard/schema";
import { toast } from "@/components/ui/use-toast";
import { createBlog, updateBlogDetail } from "@/lib/actions/blog";
import { IBlogDetail } from "@/lib/types";
import { useRouter } from "next/navigation";
import React from "react";

export default function EditForm({ blog }: { blog: IBlogDetail }) {
    const router = useRouter();
    const handleEdit = async (data: blogFormSchemaType) => {
        const result = await updateBlogDetail(blog?.id!, data);
        const { error } = JSON.parse(result);
        if (error?.message) {
            toast({
                title: "Failed to create blog",
                description: (
                    <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
                        <code className="text-white">{error.message}</code>
                    </pre>
                )
            });
        } else {
            toast({
                title: `You submitted the following values: ${data.title}`
            });
            router.push("/dashboard");
        }
    };
    return <BlogForm onHandleSubmit={handleEdit} blog={blog} />;
}
