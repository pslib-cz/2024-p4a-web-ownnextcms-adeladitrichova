// src/components/ArticleSearch.tsx
"use client"

import { useState } from 'react';
import styles from '@/app/articles/articles.module.css';

type Article = {
    id: string;
    title: string;
    content: string;
    tags: { id: string; name: string }[];
};

export default function ArticleSearch({ initialArticles }: { initialArticles: Article[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState(initialArticles);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = initialArticles.filter(article =>
            article.title.toLowerCase().includes(term) ||
            article.content.toLowerCase().includes(term) ||
            article.tags.some(tag => tag.name.toLowerCase().includes(term))
        );

        setFilteredArticles(filtered);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
            />
            {/* You can render filtered articles here or pass to parent component */}
        </div>
    );
}