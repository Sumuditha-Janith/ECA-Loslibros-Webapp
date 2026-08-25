import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';

export const metadata: Metadata = {
    title: 'LosLibros',
    description: 'LosLibros frontend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-gray-100 text-gray-800">
        <Navbar />
        <main className="container mx-auto p-4 max-w-6xl">{children}</main>
        </body>
        </html>
    );
}