// src/app/api/articles/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                tags: true,
                category: true,
            },
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching article' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            select: { authorId: true },
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const json = await request.json();
        const { title, content, categoryId, tags, published } = json;

        const updatedArticle = await prisma.article.update({
            where: { id: params.id },
            data: {
                title,
                content,
                categoryId,
                published,
                tags: {
                    set: [], // Remove all existing tags
                    connectOrCreate: tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                tags: true,
                category: true,
            },
        });

        return NextResponse.json(updatedArticle);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating article' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            select: { authorId: true },
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.article.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Article deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting article' }, { status: 500 });
    }
}