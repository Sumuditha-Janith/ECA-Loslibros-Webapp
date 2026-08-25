'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Borrowing } from '@/lib/types';

export default function BorrowingsPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    useEffect(() => {
        api.get('/api/v1/borrowings').then(res => setBorrowings(res.data));
    }, []);

    const deleteBorrowing = (id: number) => {
        if (confirm('Delete?')) {
            api.delete(`/api/v1/borrowings/${id}`)
                .then(() => setBorrowings(borrowings.filter(b => b.borrowingId !== id)));
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Borrowings</h1>
                <Link href="/borrowings/new" className="bg-blue-600 text-white px-4 py-2 rounded">New Borrowing</Link>
            </div>
            <div className="grid gap-4">
                {borrowings.map(b => (
                    <div key={b.borrowingId} className="border p-4 rounded flex justify-between">
                        <div>
                            <p><strong>Book:</strong> {b.bookIsbn}</p>
                            <p><strong>Member:</strong> {b.memberId}</p>
                            <p><strong>Borrowed:</strong> {b.borrowDate}</p>
                            <p><strong>Due:</strong> {b.dueDate}</p>
                            <p><strong>Status:</strong> {b.status}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/borrowings/${b.borrowingId}/edit`} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</Link>
                            <button onClick={() => deleteBorrowing(b.borrowingId)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}