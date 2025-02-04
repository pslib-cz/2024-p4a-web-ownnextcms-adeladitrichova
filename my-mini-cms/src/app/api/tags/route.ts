// src/app/api/tags/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tags = await prisma.tag.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error('GET tags error:', error);
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}