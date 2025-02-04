// src/app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
    try {
        const articles = await prisma.article.findMany({
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
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching articles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user's ID from the database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        if (!user?.id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const json = await request.json();
        const { title, content, categoryId, tags } = json;

        const article = await prisma.article.create({
            data: {
                title,
                content,
                author: {
                    connect: { id: user.id }
                },
                category: {
                    connect: { id: categoryId }
                },
                tags: {
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

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ error: 'Error creating article' }, { status: 500 });
    }
}