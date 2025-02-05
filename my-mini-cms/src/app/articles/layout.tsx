// src/app/articles/layout.tsx
import { Container } from '@mantine/core';

export default function ArticlesLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <Container size="xl" py="xl">
            {children}
        </Container>
    );
}