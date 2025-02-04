// src/app/dashboard/create/article/page.tsx
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { redirect } from "next/navigation";
import CreateArticleForm from "@/components/CreateArticleForm";

export default async function CreateArticlePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    // Fetch categories and tags for dropdowns
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
            <CreateArticleForm
                categories={categories}
                tags={tags}
            />
        </div>
    );
}