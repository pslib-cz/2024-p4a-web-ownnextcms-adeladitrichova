// src/app/articles/[id]/not-found.tsx
import { Container, Title, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';

export default function ArticleNotFound() {
    return (
        <Container size="lg" py="xl">
            <Title order={1} mb="xl">Article Not Found</Title>
            <Text size="lg" mb="xl">
                The article you're looking for doesn't exist or has been removed.
            </Text>
            <Group>
                <Button component={Link} href="/articles">
                    Back to Articles
                </Button>
                <Button component={Link} href="/" variant="light">
                    Go to Home
                </Button>
            </Group>
        </Container>
    );
}