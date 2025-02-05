// src/app/articles/page.tsx
import { getAuthSession } from '@/libs/auth';
import prisma from '@/libs/prisma';
import { Container, Title, Grid, Card, Text, Badge, Group, Button } from '@mantine/core';
import Link from 'next/link';

export const metadata = {
    title: 'Articles | Content Platform',
    description: 'Browse all published articles',
};

export default async function ArticlesPage() {
    const articles = await prisma.article.findMany({
        where: {
            published: true,
        },
        include: {
            author: true,
            category: true,
            tags: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <Container size="lg" py="xl">
            <Title order={1} mb="xl">Articles</Title>

            <Grid>
                {articles.map((article) => (
                    <Grid.Col key={article.id} xs={12} sm={6} lg={4}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Group position="apart" mb="xs">
                                <Text weight={500}>{article.title}</Text>
                                <Badge color="blue">{article.category.name}</Badge>
                            </Group>

                            <Text size="sm" color="dimmed" lineClamp={2} mb="md">
                                {article.content}
                            </Text>

                            <Group spacing={5}>
                                {article.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag.id} color="gray" size="sm">
                                        {tag.name}
                                    </Badge>
                                ))}
                            </Group>

                            <Text size="sm" color="dimmed" mt="md">
                                By {article.author.name || 'Anonymous'} • {
                                new Date(article.createdAt).toLocaleDateString()
                            }
                            </Text>

                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                mt="md"
                                radius="md"
                                component={Link}
                                href={`/articles/${article.id}`}
                            >
                                Read more
                            </Button>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
}