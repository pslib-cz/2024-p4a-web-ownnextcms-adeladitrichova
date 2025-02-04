// src/app/dashboard/page.tsx
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Trash2, Eye } from "lucide-react";

export default async function Dashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
            articles: {
                include: {
                    category: true,
                    tags: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            reviews: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!user) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                Welcome, {session.user.name ?? 'Creator'}
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Articles Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">My Articles</h2>
                        <Link
                            href="/dashboard/create/article"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            New Article
                        </Link>
                    </div>

                    {user.articles.length === 0 ? (
                        <p className="text-gray-500">No articles yet</p>
                    ) : (
                        <div className="space-y-4">
                            {user.articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="border-b pb-4 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-medium">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {article.category.name} | {new Date(article.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <Eye size={20} />
                                        </Link>
                                        <Link
                                            href={`/dashboard/edit/article/${article.id}`}
                                            className="text-green-500 hover:text-green-600"
                                        >
                                            <Pencil size={20} />
                                        </Link>
                                        {/* Add delete functionality */}
                                        <button
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">My Reviews</h2>
                        <Link
                            href="/dashboard/create/review"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            New Review
                        </Link>
                    </div>

                    {user.reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet</p>
                    ) : (
                        <div className="space-y-4">
                            {user.reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="border-b pb-4 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-medium">
                                            {review.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Rating: {review.rating}/5 | {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/dashboard/edit/review/${review.id}`}
                                            className="text-green-500 hover:text-green-600"
                                        >
                                            <Pencil size={20} />
                                        </Link>
                                        <button
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}