// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reviews = await prisma.review.findMany({
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('GET reviews error:', error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getAuthSession();
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
        const { title, content, rating = 0, published = false } = json;

        const review = await prisma.review.create({
            data: {
                title,
                content,
                rating,
                published,
                author: {
                    connect: { id: user.id }
                }
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('POST review error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create review" },
            { status: 500 }
        );
    }
}