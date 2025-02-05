// src/app/articles/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Grid,
    Card,
    Text,
    Badge,
    Group,
    Button,
    TextInput,
    Paper,
    Select,
} from '@mantine/core';
import Link from 'next/link';

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
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('/api/articles');
                if (!response.ok) throw new Error('Failed to fetch articles');
                const data = await response.json();
                setArticles(data);
                setFilteredArticles(data);

                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(data.map((article: Article) => article.category.name))
                );
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

    useEffect(() => {
        const filtered = articles.filter(article => {
            const matchesSearch = searchTerm === '' || (() => {
                const termLower = searchTerm.toLowerCase();
                switch (searchBy) {
                    case 'title':
                        return article.title.toLowerCase().includes(termLower);
                    case 'content':
                        return article.content.toLowerCase().includes(termLower);
                    case 'tags':
                        return article.tags.some(tag =>
                            tag.name.toLowerCase().includes(termLower)
                        );
                    default: // 'all'
                        return (
                            article.title.toLowerCase().includes(termLower) ||
                            article.content.toLowerCase().includes(termLower) ||
                            article.tags.some(tag =>
                                tag.name.toLowerCase().includes(termLower)
                            )
                        );
                }
            })();

            const matchesCategory = !selectedCategory ||
                article.category.name === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        setFilteredArticles(filtered);
    }, [searchTerm, searchBy, selectedCategory, articles]);

    if (loading) {
        return (
            <Container size="lg" py="xl">
                <Text>Loading articles...</Text>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Title order={1} mb="xl">Articles</Title>

            <Paper p="md" mb="xl" withBorder>
                <Group grow align="flex-start">
                    <TextInput
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        mb="sm"
                    />
                    <Group grow>
                        <Select
                            placeholder="Search in..."
                            value={searchBy}
                            onChange={(value) => setSearchBy(value || 'all')}
                            data={[
                                { value: 'all', label: 'All Fields' },
                                { value: 'title', label: 'Title' },
                                { value: 'content', label: 'Content' },
                                { value: 'tags', label: 'Tags' },
                            ]}
                        />
                        <Select
                            placeholder="Filter by category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            clearable
                            data={categories}
                        />
                    </Group>
                </Group>

                <Text size="sm" color="dimmed">
                    Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </Text>
            </Paper>

            {filteredArticles.length === 0 ? (
                <Text mt="xl">No articles found matching your criteria.</Text>
            ) : (
                <Grid>
                    {filteredArticles.map((article) => (
                        <Grid.Col key={article.id}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Group mb="xs">
                                    <Text>{article.title}</Text>
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
            )}
        </Container>
    );
}