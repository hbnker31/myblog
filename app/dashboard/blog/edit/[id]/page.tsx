import { readBlogContent } from "@/lib/actions/blog";
import React from "react";
import EditForm from "./components/EditForm";

export default async function Page({ params }: { params: { id: string } }) {
    const { data } = await readBlogContent(params.id);
    return <EditForm blog={data} />;
}
