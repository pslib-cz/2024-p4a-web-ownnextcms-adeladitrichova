// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('GET categories error:', error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}