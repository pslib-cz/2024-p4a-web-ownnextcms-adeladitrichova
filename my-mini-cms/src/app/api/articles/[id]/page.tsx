// src/app/articles/[id]/page.tsx
import prisma from '@/libs/prisma';
import { notFound } from 'next/navigation';
import styles from '../articles.module.css';

type ArticleDetailProps = {
    params: { id: string };
};

export async function generateMetadata({ params }: ArticleDetailProps) {
    const article = await prisma.article.findUnique({
        where: { id: params.id, published: true },
        include: { author: true },
    });

    if (!article) {
        return {
            title: 'Article Not Found',
            description: 'The requested article does not exist',
        };
    }

    return {
        title: article.title,
        description: `Article by ${article.author.name ?? 'Unknown Author'}`,
        openGraph: {
            title: article.title,
            description: article.content.slice(0, 160),
        },
    };
}

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
    const article = await prisma.article.findUnique({
        where: { id: params.id, published: true },
        include: {
            author: true,
            tags: true,
            category: true,
        },
    });

    if (!article) {
        notFound();
    }

    return (
        <div className={styles.articleDetailContainer}>
            <article className={styles.articleDetail}>
                <h1 className={styles.articleDetailTitle}>{article.title}</h1>

                <div className={styles.articleDetailMeta}>
                    <span>By {article.author.name}</span>
                    <span>Category: {article.category.name}</span>
                    <span>Published: {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>

                <div className={styles.articleContent}>
                    {article.content}
                </div>

                <div className={styles.articleTags}>
                    {article.tags.map((tag) => (
                        <span key={tag.id} className={styles.tag}>
              {tag.name}
            </span>
                    ))}
                </div>
            </article>
        </div>
    );
}