'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Book } from '@/lib/types';
import SearchBar from '@/app/components/SearchBar';

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filtered, setFiltered] = useState<Book[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/v1/books')
            .then(res => {
                setBooks(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(books.filter(b =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.includes(q)
        ));
    }, [search, books]);

    const deleteBook = (isbn: string) => {
        if (confirm('Delete this book?')) {
            api.delete(`/api/v1/books/${isbn}`)
                .then(() => {
                    const updated = books.filter(b => b.isbn !== isbn);
                    setBooks(updated);
                })
                .catch(err => alert('Delete failed'));
        }
    };

    if (loading) return <div className="py-8 text-center text-[#3C2A21]">Loading...</div>;

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h1 className="text-2xl font-bold text-[#1A120B]">Books</h1>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search books..." />
                    <Link href="/books/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition">
                        Add Book
                    </Link>
                </div>
            </div>
            <div className="grid gap-3">
                {filtered.map(book => (
                    <div key={book.isbn} className="bg-[#D5CEA3] border border-[#3C2A21] rounded p-4 flex flex-wrap items-center justify-between shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold text-[#1A120B]">{book.title}</h2>
                            <p className="text-[#3C2A21] text-sm">by {book.author} · ISBN: {book.isbn}</p>
                            <Link href={`/books/${book.isbn}`} className="text-[#1A120B] text-sm underline hover:no-underline">View Details</Link>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <Link href={`/books/${book.isbn}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition">Edit</Link>
                            <button onClick={() => deleteBook(book.isbn)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition">Delete</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-[#3C2A21]">No books found.</p>}
            </div>
        </div>
    );
}