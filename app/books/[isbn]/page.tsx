'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Book } from '@/lib/types';

export default function BookDetailPage() {
    const { isbn } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/books/${isbn}`)
            .then(res => setBook(res.data))
            .catch(err => alert('Book not found'))
            .finally(() => setLoading(false));
    }, [isbn]);

    if (loading) return <div>Loading...</div>;
    if (!book) return <div>Not found</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-gray-600">by {book.author}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Publisher:</strong> {book.publisher || '—'}</p>
            <p><strong>Year:</strong> {book.publishedYear || '—'}</p>
            <p><strong>Genre:</strong> {book.genre || '—'}</p>
            {book.coverImageUrl && (
                <div className="mt-4">
                    <img src={book.coverImageUrl} alt="Cover" className="max-w-xs max-h-60 object-contain" />
                </div>
            )}
            <div className="mt-4 flex gap-2">
                <Link href={`/books/${isbn}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</Link>
                <Link href="/books" className="bg-gray-300 px-4 py-2 rounded">Back</Link>
            </div>
        </div>
    );
}