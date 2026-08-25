'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Book, Borrowing } from '@/lib/types';
import { useToast } from '@/app/components/Toast';

export default function BookDetailPage() {
    const { isbn } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(true);

    const toast = useToast();

    useEffect(() => {
        Promise.all([
            api.get(`/api/v1/books/${isbn}`),
            api.get('/api/v1/borrowings')
        ])
            .then(([bookRes, borrowRes]) => {
                setBook(bookRes.data);
                const bookBorrowings = (borrowRes.data || []).filter((b: Borrowing) => b.bookIsbn === isbn);
                setBorrowings(bookBorrowings);
            })
            .catch(() => toast.error('Book details could not be found'))
            .finally(() => setLoading(false));
    }, [isbn]);

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-400 text-sm font-medium">Fetching book metadata...</p>
        </div>
    );

    if (!book) return (
        <div className="glass-panel p-12 text-center rounded-3xl border border-stone-800 my-8">
            <h2 className="text-xl font-bold text-stone-200">Book Not Found</h2>
            <p className="text-xs text-stone-400 mt-2 mb-4">No publication matching ISBN {isbn} was found in the library database.</p>
            <Link href="/books" className="px-4 py-2 bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold">
                ← Back to Catalog
            </Link>
        </div>
    );

    const activeLoan = borrowings.find(b => b.status === 'BORROWED');

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/books"
                    className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-100 text-xs font-semibold transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Books Catalog
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/books/${isbn}/edit`}
                        className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold transition"
                    >
                        Edit Details
                    </Link>
                </div>
            </div>

            {/* Book Main Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col md:flex-row gap-8">
                {/* Cover Image Showcase */}
                <div className="w-full md:w-64 h-80 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0 shadow-lg relative">
                    {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-950/80 to-stone-900 flex flex-col items-center justify-center p-6 text-center">
                            <svg className="w-16 h-16 text-amber-500/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-sm font-bold text-amber-200">{book.title}</span>
                        </div>
                    )}

                    <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${
                            activeLoan
                                ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        }`}>
                            {activeLoan ? 'CURRENTLY BORROWED' : 'AVAILABLE IN LIBRARY'}
                        </span>
                    </div>
                </div>

                {/* Information Details */}
                <div className="flex-1 space-y-5">
                    <div>
                        {book.genre && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-2">
                                {book.genre}
                            </span>
                        )}
                        <h1 className="text-3xl font-extrabold text-stone-100 font-[Outfit]">{book.title}</h1>
                        <p className="text-stone-300 text-base mt-1 font-medium">by <span className="text-amber-400">{book.author}</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-800/80">
                        <div>
                            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">ISBN</p>
                            <p className="text-sm font-mono text-stone-200 mt-0.5">{book.isbn}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Publisher</p>
                            <p className="text-sm text-stone-200 mt-0.5">{book.publisher || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Publication Year</p>
                            <p className="text-sm text-stone-200 mt-0.5">{book.publishedYear || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Total Loan History</p>
                            <p className="text-sm font-bold text-amber-400 mt-0.5">{borrowings.length} records</p>
                        </div>
                    </div>

                    {/* Status & Loan Call to Action */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        {activeLoan ? (
                            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex-1">
                                <p className="font-semibold">Checked out to Member: {activeLoan.memberId}</p>
                                <p className="opacity-80 mt-0.5">Borrowed on {activeLoan.borrowDate} · Due date: {activeLoan.dueDate}</p>
                            </div>
                        ) : (
                            <Link
                                href={`/borrowings/new`}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
                            >
                                Issue This Book →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Circulation History Log */}
            <div className="glass-panel p-6 rounded-3xl border border-stone-800 space-y-4">
                <h3 className="text-lg font-bold text-stone-100 font-[Outfit]">Borrowing History</h3>
                {borrowings.length === 0 ? (
                    <p className="text-xs text-stone-500 py-4 text-center">No previous loan records for this book.</p>
                ) : (
                    <div className="divide-y divide-stone-800">
                        {borrowings.map((b) => (
                            <div key={b.borrowingId} className="py-3 flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-semibold text-stone-200">Member: {b.memberId}</span>
                                    <p className="text-stone-400 mt-0.5">Borrowed: {b.borrowDate} · Due: {b.dueDate}</p>
                                </div>
                                <div>
                                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                                        b.status === 'BORROWED' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                        {b.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}