import Link from 'next/link';

export default function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
