// src/app/page.tsx
import styles from './home.module.css';

export default function Home() {
    return (
        <main className={styles.container}>
            <div className={styles.welcomeText}>Welcome to the</div>
            <h1 className={styles.title}>Article World</h1>
            <h2 className={styles.subtitle}>Journalist incubator</h2>
        </main>
    );
}