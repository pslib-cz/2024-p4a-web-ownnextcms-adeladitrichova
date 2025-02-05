// src/app/articles/[id]/page.tsx
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';
import { notFound } from 'next/navigation';
import { Card, Container, Title, Text, Badge, Stack, Group } from '@mantine/core';

interface ArticlePageProps {
    params: {
        id: string;
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
    const article = await prisma.article.findUnique({
        where: {
            id: params.id,
            published: true
        },
        include: {
            author: true,
            category: true,
            tags: true,
        },
    });

    if (!article) {
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found',
        };
    }

    return {
        title: article.title,
        description: article.content.slice(0, 160) + '...',
        authors: [{ name: article.author.name || 'Anonymous' }],
        keywords: article.tags.map(tag => tag.name),
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const session = await getAuthSession();
    const article = await prisma.article.findUnique({
        where: {
            id: params.id,
            ...(session?.user ? {} : { published: true }), // Only show published articles to non-logged in users
        },
        include: {
            author: true,
            category: true,
            tags: true,
        },
    });

    if (!article) {
        notFound();
    }

    return (
        <Container size="lg" py="xl">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack>
                    <Title order={1}>{article.title}</Title>

                    <Group>
                        <Group>
                            <Text size="sm" color="dimmed">By</Text>
                            <Text size="sm">{article.author.name || 'Anonymous'}</Text>
                        </Group>

                        <Text size="sm" color="dimmed">
                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </Group>

                    <Group>
                        <Badge color="blue">{article.category.name}</Badge>
                        {article.tags.map(tag => (
                            <Badge key={tag.id} color="gray">{tag.name}</Badge>
                        ))}
                    </Group>

                    {/* If you want to support markdown content */}
                    <Text>{article.content}</Text>

                    {/* Show draft status for authors */}
                    {session?.user?.email === article.author.email && !article.published && (
                        <Badge color="yellow" size="lg">Draft</Badge>
                    )}
                </Stack>
            </Card>
        </Container>
    );
}