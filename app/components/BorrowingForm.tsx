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
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, setValue } = useForm<BorrowingRequest>({
        defaultValues: initialData || {
            borrowDate: '',
            dueDate: '',
            returnDate: '',
            bookIsbn: '',
            memberId: '',
        },
    });

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/books'),
            api.get('/api/v1/members')
        ]).then(([bookRes, memberRes]) => {
            setBooks(bookRes.data);
            setMembers(memberRes.data);
            if (initialData) {
                setValue('bookIsbn', initialData.bookIsbn);
                setValue('memberId', initialData.memberId);
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [initialData, setValue]);

    if (loading) return <div className="py-8 text-center text-[#3C2A21]">Loading form...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-[#D5CEA3] p-6 rounded shadow-sm border border-[#3C2A21]">
            <h1 className="text-2xl font-bold text-[#1A120B] mb-4">{isEdit ? 'Edit Borrowing' : 'New Borrowing'}</h1>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Borrow Date</label>
                <input type="date" {...register('borrowDate', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Due Date</label>
                <input type="date" {...register('dueDate', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Return Date</label>
                <input type="date" {...register('returnDate')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Book</label>
                <select {...register('bookIsbn', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]">
                    <option value="">Select Book</option>
                    {books.map(b => <option key={b.isbn} value={b.isbn}>{b.title} ({b.isbn})</option>)}
                </select>
            </div>
            <div className="mb-4">
                <label className="block font-medium text-sm text-[#3C2A21]">Member</label>
                <select {...register('memberId', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]">
                    <option value="">Select Member</option>
                    {members.map(m => <option key={m.memberId} value={m.memberId}>{m.fullName} ({m.memberId})</option>)}
                </select>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Save</button>
        </form>
    );
}