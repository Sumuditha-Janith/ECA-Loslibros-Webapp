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

    if (loading) return <div className="py-8 text-center text-[#3C2A21]">Loading...</div>;
    if (!book) return <div className="py-8 text-center text-[#3C2A21]">Not found</div>;

    return (
        <div className="max-w-2xl mx-auto bg-[#D5CEA3] p-6 rounded shadow-sm border border-[#3C2A21]">
            <h1 className="text-2xl font-bold text-[#1A120B]">{book.title}</h1>
            <p className="text-[#3C2A21]">by {book.author}</p>
            <p className="text-[#3C2A21]"><strong>ISBN:</strong> {book.isbn}</p>
            <p className="text-[#3C2A21]"><strong>Publisher:</strong> {book.publisher || '—'}</p>
            <p className="text-[#3C2A21]"><strong>Year:</strong> {book.publishedYear || '—'}</p>
            <p className="text-[#3C2A21]"><strong>Genre:</strong> {book.genre || '—'}</p>
            {book.coverImageUrl && (
                <div className="mt-4">
                    <img src={book.coverImageUrl} alt="Cover" className="max-w-xs max-h-60 object-contain" />
                </div>
            )}
            <div className="mt-4 flex gap-2">
                <Link href={`/books/${isbn}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition">Edit</Link>
                <Link href="/books" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition">Back</Link>
            </div>
        </div>
    );
}