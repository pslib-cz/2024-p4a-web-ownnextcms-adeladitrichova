// src/app/layout.tsx
'use client';

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from "next-auth/react";
import MainNavigation from "@/components/MainNavigation";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                       children
                                   }: {

    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <MantineProvider>
            <SessionProvider>
                <MainNavigation/>
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </SessionProvider>
        </MantineProvider>
        </body>
        </html>
    );
}