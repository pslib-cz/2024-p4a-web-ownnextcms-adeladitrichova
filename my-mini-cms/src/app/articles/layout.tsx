// src/app/articles/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Articles | MyContentPlatform',
    description: 'Browse all published articles',
};

export default function ArticlesLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return children;
}