'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Borrowing, Book } from '@/lib/types';
import SearchBar from '@/app/components/SearchBar';

export default function BorrowingsPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [books, setBooks] = useState<Record<string, Book>>({});
    const [filtered, setFiltered] = useState<Borrowing[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/borrowings'),
            api.get('/api/v1/books')
        ]).then(([borrowRes, bookRes]) => {
            setBorrowings(borrowRes.data);
            const bookMap: Record<string, Book> = {};
            bookRes.data.forEach((b: Book) => bookMap[b.isbn] = b);
            setBooks(bookMap);
            setFiltered(borrowRes.data);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(borrowings.filter(b => {
            const bookTitle = books[b.bookIsbn]?.title?.toLowerCase() || '';
            return bookTitle.includes(q) ||
                b.memberId.toLowerCase().includes(q) ||
                b.bookIsbn.includes(q) ||
                b.status.toLowerCase().includes(q);
        }));
    }, [search, borrowings, books]);

    const deleteBorrowing = (id: number) => {
        if (confirm('Delete this borrowing record?')) {
            api.delete(`/api/v1/borrowings/${id}`)
                .then(() => {
                    const updated = borrowings.filter(b => b.borrowingId !== id);
                    setBorrowings(updated);
                })
                .catch(err => alert('Delete failed'));
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h1 className="text-2xl font-bold">Borrowings</h1>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search borrowings..." />
                    <Link href="/borrowings/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition">
                        New Borrowing
                    </Link>
                </div>
            </div>
            <div className="grid gap-3">
                {filtered.map(b => {
                    const book = books[b.bookIsbn];
                    return (
                        <div key={b.borrowingId} className="bg-white border border-gray-200 rounded p-4 flex flex-wrap items-center justify-between shadow-sm">
                            <div>
                                <p className="font-semibold">{book ? book.title : b.bookIsbn}</p>
                                <p className="text-gray-600 text-sm">Member: {b.memberId}</p>
                                <p className="text-gray-600 text-sm">Borrowed: {b.borrowDate} · Due: {b.dueDate}</p>
                                <p className="text-sm">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      b.status === 'BORROWED' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {b.status}
                  </span>
                                </p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <Link href={`/borrowings/${b.borrowingId}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition">Edit</Link>
                                <button onClick={() => deleteBorrowing(b.borrowingId)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition">Delete</button>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && <p className="text-gray-500">No borrowings found.</p>}
            </div>
        </div>
    );
}