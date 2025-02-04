"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, Tag } from "@prisma/client";

type CreateArticleFormProps = {
    categories: Category[];
    tags: Tag[];
};

export default function CreateArticleForm({
                                              categories,
                                              tags
                                          }: CreateArticleFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPublished, setIsPublished] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    categoryId,
                    tags: selectedTags,
                    published: isPublished,
                }),
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create article");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setError("An unexpected error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    maxLength={200}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                    Content
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                    required
                    maxLength={5000}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                </label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tags
                </label>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <label key={tag.id} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedTags([...selectedTags, tag.id]);
                                    } else {
                                        setSelectedTags(selectedTags.filter((t) => t !== tag.id));
                                    }
                                }}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{tag.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="form-checkbox"
                    />
                    <span className="ml-2">Publish Article</span>
                </label>
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Article
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}