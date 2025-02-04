// src/components/MainNavigation.tsx
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import {
    Home,
    BookOpen,
    PenTool,
    LogIn,
    LogOut,
    User,
    Menu as MenuIcon
} from 'lucide-react';

export default function MainNavigation() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
                    <BookOpen className="mr-2" /> MyContentPlatform
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-600 hover:text-blue-600"
                >
                    <MenuIcon />
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="flex items-center text-gray-700 hover:text-blue-600 transition"
                    >
                        <Home className="mr-2" size={20} /> Home
                    </Link>
                    <Link
                        href="/articles"
                        className="flex items-center text-gray-700 hover:text-blue-600 transition"
                    >
                        <BookOpen className="mr-2" size={20} /> Articles
                    </Link>

                    {session ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="flex items-center text-gray-700 hover:text-blue-600 transition"
                            >
                                <User className="mr-2" size={20} /> Dashboard
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                            >
                                <LogOut className="mr-2" size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn('github')}
                            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            <LogIn className="mr-2" size={20} /> Login
                        </button>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
                        <div className="flex flex-col p-4 space-y-2">
                            <Link
                                href="/"
                                className="flex items-center p-2 hover:bg-gray-100 rounded"
                                onClick={toggleMenu}
                            >
                                <Home className="mr-2" size={20} /> Home
                            </Link>
                            <Link
                                href="/articles"
                                className="flex items-center p-2 hover:bg-gray-100 rounded"
                                onClick={toggleMenu}
                            >
                                <BookOpen className="mr-2" size={20} /> Articles
                            </Link>

                            {session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                                        onClick={toggleMenu}
                                    >
                                        <User className="mr-2" size={20} /> Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            toggleMenu();
                                        }}
                                        className="flex items-center p-2 hover:bg-gray-100 rounded text-red-500"
                                    >
                                        <LogOut className="mr-2" size={20} /> Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        signIn('github');
                                        toggleMenu();
                                    }}
                                    className="flex items-center p-2 hover:bg-gray-100 rounded text-blue-500"
                                >
                                    <LogIn className="mr-2" size={20} /> Login
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}