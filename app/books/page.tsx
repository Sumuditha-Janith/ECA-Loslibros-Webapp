'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Book } from '@/lib/types';

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/v1/books')
            .then(res => setBooks(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const deleteBook = (isbn: string) => {
        if (confirm('Delete this book?')) {
            api.delete(`/api/v1/books/${isbn}`)
                .then(() => setBooks(books.filter(b => b.isbn !== isbn)))
                .catch(err => alert('Delete failed'));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Books</h1>
                <Link href="/books/new" className="bg-blue-600 text-white px-4 py-2 rounded">Add Book</Link>
            </div>
            <div className="grid gap-4">
                {books.map(book => (
                    <div key={book.isbn} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <h2 className="text-xl">{book.title}</h2>
                            <p className="text-gray-600">by {book.author} | ISBN: {book.isbn}</p>
                            <Link href={`/books/${book.isbn}`} className="text-blue-600 text-sm">View Details</Link>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/books/${book.isbn}/edit`} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</Link>
                            <button onClick={() => deleteBook(book.isbn)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}