import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import { ToastProvider } from '@/app/components/Toast';

export const metadata: Metadata = {
    title: 'LosLibros | Modern Library System',
    description: 'A modern library management service for books, members, and borrowings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
                <ToastProvider>
                    <Navbar />
                    <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl flex-1 animate-fade-in">
                        {children}
                    </main>
                    <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-500 glass-panel mt-auto">
                        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="font-bold tracking-wider text-amber-500 font-[Outfit]">LOSLIBROS</span>
                                <span>— Library Management Service</span>
                            </div>
                            <p>© {new Date().getFullYear()} LosLibros System. All rights reserved.</p>
                        </div>
                    </footer>
                </ToastProvider>
            </body>
        </html>
    );
}