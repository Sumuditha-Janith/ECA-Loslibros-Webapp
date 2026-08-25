'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Book, Borrowing } from '@/lib/types';
import SearchBar from '@/app/components/SearchBar';
import { useToast } from '@/app/components/Toast';
import ConfirmModal from '@/app/components/ConfirmModal';

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [filtered, setFiltered] = useState<Book[]>([]);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);

    // Delete Modal State
    const [deleteIsbn, setDeleteIsbn] = useState<string | null>(null);

    const toast = useToast();

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/books'),
            api.get('/api/v1/borrowings')
        ]).then(([booksRes, borrowRes]) => {
            setBooks(booksRes.data || []);
            setBorrowings(borrowRes.data || []);
            setFiltered(booksRes.data || []);
        }).catch((err) => {
            console.error(err);
            toast.error('Failed to load books catalog');
        }).finally(() => setLoading(false));
    }, []);

    // Unique genres for filter pills
    const genres = Array.from(new Set(books.map(b => b.genre).filter(Boolean))) as string[];

    useEffect(() => {
        const q = search.toLowerCase();
        let result = books.filter(b =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.includes(q) ||
            (b.genre && b.genre.toLowerCase().includes(q))
        );

        if (selectedGenre !== 'ALL') {
            result = result.filter(b => b.genre === selectedGenre);
        }

        setFiltered(result);
    }, [search, selectedGenre, books]);

    const activeBorrowedIsbns = new Set(
        borrowings.filter(b => b.status === 'BORROWED').map(b => b.bookIsbn)
    );

    const confirmDelete = () => {
        if (!deleteIsbn) return;
        const isbn = deleteIsbn;
        setDeleteIsbn(null);

        api.delete(`/api/v1/books/${isbn}`)
            .then(() => {
                setBooks(prev => prev.filter(b => b.isbn !== isbn));
                toast.success('Book deleted successfully');
            })
            .catch(() => {
                toast.error('Failed to delete book');
            });
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3 shrink-0"></div>
                <p className="text-stone-400 text-sm font-medium">Loading books catalog...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-stone-800">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-[Outfit]">Book Catalog</h1>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">Browse, search, and manage library publications ({filtered.length} items)</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search title, author, ISBN..." />

                    {/* View Switcher Toggle */}
                    <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                viewMode === 'grid' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                            }`}
                            title="Grid View"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                viewMode === 'list' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                            }`}
                            title="List View"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <Link
                        href="/books/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] shrink-0 whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Book</span>
                    </Link>
                </div>
            </div>

            {/* Genre Filter Pills */}
            {genres.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedGenre('ALL')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                            selectedGenre === 'ALL'
                                ? 'bg-amber-500 text-stone-950 shadow-md'
                                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                    >
                        All Genres ({books.length})
                    </button>
                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                                selectedGenre === genre
                                    ? 'bg-amber-500 text-stone-950 shadow-md'
                                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="glass-panel p-12 text-center rounded-3xl border border-stone-800 my-8">
                    <svg className="w-12 h-12 shrink-0 text-stone-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-lg font-bold text-stone-200">No books found</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">Try adjusting your search filter or add a new book to the library system.</p>
                </div>
            )}

            {/* Grid View Rendering */}
            {viewMode === 'grid' && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(book => {
                        const isBorrowed = activeBorrowedIsbns.has(book.isbn);

                        return (
                            <div key={book.isbn} className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 group">
                                <div className="space-y-3">
                                    {/* Cover Image & Status Badge */}
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-900 border border-stone-800 group-hover:border-amber-500/40 transition">
                                        {book.coverImageUrl ? (
                                            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-950/60 to-stone-900 flex flex-col items-center justify-center p-4 text-center">
                                                <svg className="w-10 h-10 shrink-0 text-amber-500/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span className="text-xs font-bold text-amber-200 line-clamp-2">{book.title}</span>
                                            </div>
                                        )}

                                        <div className="absolute top-2.5 right-2.5 z-10">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md whitespace-nowrap shrink-0 ${
                                                isBorrowed
                                                    ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                                            }`}>
                                                {isBorrowed ? 'BORROWED' : 'AVAILABLE'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        {book.genre && (
                                            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-1 whitespace-nowrap">
                                                {book.genre}
                                            </span>
                                        )}
                                        <h3 className="text-base font-bold text-stone-100 line-clamp-1 group-hover:text-amber-400 transition">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-stone-400 mt-0.5">by {book.author}</p>
                                        <p className="text-[11px] text-stone-500 mt-2 font-mono">ISBN: {book.isbn}</p>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                                    <Link
                                        href={`/books/${book.isbn}`}
                                        className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline whitespace-nowrap shrink-0"
                                    >
                                        Details →
                                    </Link>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Link
                                            href={`/books/${book.isbn}/edit`}
                                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition shrink-0"
                                            title="Edit"
                                        >
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => setDeleteIsbn(book.isbn)}
                                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 transition shrink-0"
                                            title="Delete"
                                        >
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* List View Rendering */}
            {viewMode === 'list' && filtered.length > 0 && (
                <div className="glass-panel rounded-3xl border border-stone-800 overflow-hidden divide-y divide-stone-800">
                    {filtered.map(book => {
                        const isBorrowed = activeBorrowedIsbns.has(book.isbn);

                        return (
                            <div key={book.isbn} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-900/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-16 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0">
                                        {book.coverImageUrl ? (
                                            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-amber-950/40 flex items-center justify-center text-amber-500 font-bold text-xs">
                                                BOOK
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-stone-100 text-base">{book.title}</h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shrink-0 ${
                                                isBorrowed
                                                    ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                                            }`}>
                                                {isBorrowed ? 'BORROWED' : 'AVAILABLE'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-400 mt-0.5">
                                            by {book.author} · {book.publisher || 'Unknown Publisher'} ({book.publishedYear || 'N/A'})
                                        </p>
                                        <p className="text-[11px] text-stone-500 mt-1 font-mono">ISBN: {book.isbn} {book.genre ? `· Genre: ${book.genre}` : ''}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    <Link
                                        href={`/books/${book.isbn}`}
                                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium whitespace-nowrap transition shrink-0"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={`/books/${book.isbn}/edit`}
                                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/20 whitespace-nowrap transition shrink-0"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteIsbn(book.isbn)}
                                        className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-semibold border border-rose-900/40 whitespace-nowrap transition shrink-0"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={!!deleteIsbn}
                title="Delete Book Record"
                message="Are you sure you want to delete this book from the catalog? This action cannot be undone."
                confirmText="Delete Book"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteIsbn(null)}
            />
        </div>
    );
}