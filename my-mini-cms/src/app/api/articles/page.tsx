// src/app/articles/page.tsx
import prisma from '@/libs/prisma';
import Link from 'next/link';
import styles from './articles.module.css';

export const metadata = {
    title: 'Published Articles',
    description: 'Browse our latest published articles',
};

export default async function ArticlesPage() {
    const publishedArticles = await prisma.article.findMany({
        where: {published: true},
        include: {
            author: {
                select: {
                    name: true,
                    image: true,
                },
            },
            tags: true,
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className={styles.articlesContainer}>
            <h1 className={styles.pageTitle}>Published Articles</h1>

            {publishedArticles.length === 0 ? (
                <p className={styles.noArticles}>No published articles found.</p>
            ) : (
                <div className={styles.articleGrid}>
                    {publishedArticles.map((article) => (
                        <div key={article.id} className={styles.articleCard}>
                            <Link href={`/articles/${article.id}`} className={styles.articleLink}>
                                <h2 className={styles.articleTitle}>{article.title}</h2>
                            </Link>
                            <div className={styles.articleMeta}>
                <span className={styles.authorName}>
                  {article.author.name}
                </span>
                                <span className={styles.categoryTag}>
                  {article.category.name}
                </span>
                                <span className={styles.publishDate}>
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                            </div>
                            <div className={styles.articleTags}>
                                {article.tags.map((tag) => (
                                    <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}