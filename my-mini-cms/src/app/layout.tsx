// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";
import MainNavigation from "@/components/MainNavigation";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                       children
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider>
            <MainNavigation />
            <div className="pt-16">  {/* Add padding to account for fixed navbar */}
                {children}
            </div>
        </SessionProvider>
        </body>
        </html>
    );
}