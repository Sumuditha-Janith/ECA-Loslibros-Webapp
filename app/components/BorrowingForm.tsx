'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { BorrowingRequest, Book, Member } from '@/lib/types';

interface BorrowingFormProps {
    initialData?: BorrowingRequest & { borrowingId?: number };
    onSubmit: (data: BorrowingRequest) => void;
    isEdit?: boolean;
}

export default function BorrowingForm({ initialData, onSubmit, isEdit }: BorrowingFormProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const { register, handleSubmit } = useForm<BorrowingRequest>({
        defaultValues: initialData || { borrowDate: '', dueDate: '', bookIsbn: '', memberId: '' },
    });

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/books').then(res => setBooks(res.data)),
            api.get('/api/v1/members').then(res => setMembers(res.data)),
        ]);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Borrowing' : 'New Borrowing'}</h1>
            <div className="mb-3">
                <label className="block font-medium">Borrow Date</label>
                <input type="date" {...register('borrowDate', { required: true })} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium">Due Date</label>
                <input type="date" {...register('dueDate', { required: true })} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium">Return Date</label>
                <input type="date" {...register('returnDate')} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium">Book</label>
                <select {...register('bookIsbn', { required: true })} className="w-full border p-2 rounded">
                    <option value="">Select Book</option>
                    {books.map(b => <option key={b.isbn} value={b.isbn}>{b.title} ({b.isbn})</option>)}
                </select>
            </div>
            <div className="mb-3">
                <label className="block font-medium">Member</label>
                <select {...register('memberId', { required: true })} className="w-full border p-2 rounded">
                    <option value="">Select Member</option>
                    {members.map(m => <option key={m.memberId} value={m.memberId}>{m.fullName} ({m.memberId})</option>)}
                </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
    );
}