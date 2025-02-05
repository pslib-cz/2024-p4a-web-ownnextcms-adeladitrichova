// src/app/api/articles/[id]/route.ts
import { NextRequest } from 'next/server';
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const session = await getAuthSession();

    try {
        const article = await prisma.article.findUnique({
            where: {
                id: resolvedParams.id,
                ...(session?.user ? {} : { published: true })
            },
            include: {
                author: {
                    select: { name: true, email: true }
                },
                category: true,
                tags: true
            }
        });

        if (!article) {
            return Response.json({ error: 'Not found' }, { status: 404 });
        }

        return Response.json(article);
    } catch (error) {
        return Response.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const session = await getAuthSession();

    if (!session?.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const article = await prisma.article.findUnique({
            where: { id: resolvedParams.id },
            include: { author: true },
        });

        if (!article) {
            return Response.json({ error: "Article not found" }, { status: 404 });
        }

        if (article.author.email !== session.user.email) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const json = await req.json();
        const { title, content, categoryId, tags = [], published } = json;

        const updatedArticle = await prisma.article.update({
            where: { id: resolvedParams.id },
            data: {
                title,
                content,
                published,
                category: {
                    connect: { id: categoryId }
                },
                tags: {
                    set: [],
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

        return Response.json(updatedArticle);
    } catch (error) {
        return Response.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const session = await getAuthSession();

    if (!session?.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const article = await prisma.article.findUnique({
            where: { id: resolvedParams.id },
            include: { author: true },
        });

        if (!article) {
            return Response.json({ error: "Article not found" }, { status: 404 });
        }

        if (article.author.email !== session.user.email) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.article.delete({
            where: { id: resolvedParams.id },
        });

        return Response.json({ message: "Article deleted successfully" });
    } catch (error) {
        return Response.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}