// src/app/api/articles/[id]/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';

// GET single article
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                category: true,
                tags: true,
            },
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        // Check if the user owns this article
        if (article.author.email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error('GET article error:', error);
        return NextResponse.json(
            { error: "Failed to fetch article" },
            { status: 500 }
        );
    }
}

// UPDATE article
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: { author: true },
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        // Check if the user owns this article
        if (article.author.email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const json = await request.json();
        const { title, content, categoryId, tags = [], published } = json;

        const updatedArticle = await prisma.article.update({
            where: { id: params.id },
            data: {
                title,
                content,
                published,
                category: {
                    connect: { id: categoryId }
                },
                tags: {
                    set: [], // Clear existing tags
                    connect: tags.map((tagId: string) => ({ id: tagId }))
                }
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                category: true,
                tags: true,
            }
        });

        return NextResponse.json(updatedArticle);
    } catch (error) {
        console.error('PUT article error:', error);
        return NextResponse.json(
            { error: "Failed to update article" },
            { status: 500 }
        );
    }
}

// DELETE article
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: { author: true },
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        // Check if the user owns this article
        if (article.author.email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.article.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error('DELETE article error:', error);
        return NextResponse.json(
            { error: "Failed to delete article" },
            { status: 500 }
        );
    }
}