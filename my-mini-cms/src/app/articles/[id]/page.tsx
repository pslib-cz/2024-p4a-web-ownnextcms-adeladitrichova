// src/app/articles/[id]/page.tsx
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';
import { notFound } from 'next/navigation';
import { Card, Container, Title, Text, Badge, Stack, Group } from '@mantine/core';

type PageProps = {
    params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
    const resolvedParams = await params;
    const article = await prisma.article.findUnique({
        where: { id: resolvedParams.id },
        include: { author: true }
    });

    return {
        title: article?.title || 'Article Not Found'
    };
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    const session = await getAuthSession();
    const article = await prisma.article.findUnique({
        where: {
            id: resolvedParams.id,
            ...(session?.user ? {} : { published: true })
        },
        include: {
            author: true,
            category: true,
            tags: true
        }
    });

    if (!article) notFound();

    return (
        <Container size="lg" py="xl">
            <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack>
                    <Title order={1}>{article.title}</Title>
                    <Group>
                        <Text fw={500}>{article.author.name || 'Anonymous'}</Text>
                        <Text c="dimmed">{new Date(article.createdAt).toLocaleDateString()}</Text>
                    </Group>
                    <Group>
                        <Badge color="blue">{article.category.name}</Badge>
                        {article.tags.map(tag => (
                            <Badge key={tag.id} color="gray">{tag.name}</Badge>
                        ))}
                    </Group>
                    <Text>{article.content}</Text>
                    {session?.user?.email === article.author.email && !article.published && (
                        <Badge color="yellow" size="lg">Draft</Badge>
                    )}
                </Stack>
            </Card>
        </Container>
    );
}