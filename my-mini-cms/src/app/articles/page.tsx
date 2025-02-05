// src/app/articles/page.tsx
'use client';

import { Container, Title, Grid, Card, Text, Badge, Group, Button } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Article = {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    author: {
        name: string | null;
        email: string | null;
    };
    category: {
        name: string;
    };
    tags: Array<{
        id: string;
        name: string;
    }>;
};

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('/api/articles');
                if (!response.ok) throw new Error('Failed to fetch articles');
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <Container size="lg" py="xl">
                <Text>Loading articles...</Text>
            </Container>
        );
    }

    if (articles.length === 0) {
        return (
            <Container size="lg" py="xl">
                <Title order={1} mb="xl">Articles</Title>
                <Text>No articles found.</Text>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Title order={1} mb="xl">Articles</Title>

            <Grid>
                {articles.map((article) => (
                    <Grid.Col key={article.id}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Group mb="xs">
                                <Text >{article.title}</Text>
                                <Badge color="blue">{article.category.name}</Badge>
                            </Group>

                            <Text size="sm" color="dimmed" lineClamp={2} mb="md">
                                {article.content}
                            </Text>

                            <Group>
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