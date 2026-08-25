import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';

export const metadata: Metadata = {
    title: 'Library Management',
    description: 'Minimalistic frontend for ECA Library',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-gray-50">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
        </body>
        </html>
    );
}