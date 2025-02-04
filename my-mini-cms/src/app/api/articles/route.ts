// src/app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const articles = await prisma.article.findMany({
            where: {
                author: {
                    email: session.user.email
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(articles);
    } catch (error) {
        console.error('GET articles error:', error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const json = await request.json();
        const { title, content, categoryId, tags = [], published = false } = json;

        // Create default category if none exists
        let category = await prisma.category.findFirst();
        if (!category) {
            category = await prisma.category.create({
                data: { name: 'General' }
            });
        }

        const article = await prisma.article.create({
            data: {
                title,
                content,
                published,
                author: {
                    connect: { id: user.id }
                },
                category: {
                    connect: { id: categoryId || category.id }
                },
                ...(tags.length > 0 && {
                    tags: {
                        connect: tags.map((tagId: string) => ({ id: tagId }))
                    }
                })
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

        return NextResponse.json(article);
    } catch (error) {
        console.error('POST article error:', error);
        return NextResponse.json(
            { error: "Failed to create article" },
            { status: 500 }
        );
    }
}