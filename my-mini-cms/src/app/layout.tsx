// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
    title: {
        default: 'Content Publishing Platform',
        template: '%s | Content Publishing Platform'
    },
    description: 'A comprehensive platform for creating, sharing, and discovering content',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://your-domain.com',
        siteName: 'Content Publishing Platform',
        images: [
            {
                url: '/og-image.png', // Create an Open Graph image
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@yourhandle', // Replace with your Twitter handle
        creator: '@yourhandle',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png' },
        ],
    },
    verification: {
        google: 'your-google-site-verification-code', // Optional
        // Add other verification codes as needed
    },
};