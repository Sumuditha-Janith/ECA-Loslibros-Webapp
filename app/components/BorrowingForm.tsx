'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { BorrowingRequest, Book, Member } from '@/lib/types';
import Link from 'next/link';

interface BorrowingFormProps {
    initialData?: BorrowingRequest & { borrowingId?: number };
    onSubmit: (data: BorrowingRequest) => void;
    isEdit?: boolean;
}

export default function BorrowingForm({ initialData, onSubmit, isEdit }: BorrowingFormProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BorrowingRequest>({
        defaultValues: initialData || {
            borrowDate: todayStr,
            dueDate: defaultDue,
            returnDate: '',
            bookIsbn: '',
            memberId: '',
        },
    });

    const currentBorrowDate = watch('borrowDate');

    const setFourteenDays = () => {
        if (currentBorrowDate) {
            const date = new Date(currentBorrowDate);
            date.setDate(date.getDate() + 14);
            setValue('dueDate', date.toISOString().split('T')[0]);
        }
    };

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/books'),
            api.get('/api/v1/members')
        ]).then(([bookRes, memberRes]) => {
            setBooks(bookRes.data || []);
            setMembers(memberRes.data || []);
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

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-400 text-sm">Loading catalog resources...</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-100 font-[Outfit]">
                        {isEdit ? 'Edit Borrowing Record' : 'Issue Book Loan'}
                    </h1>
                    <p className="text-xs text-stone-400 mt-1">
                        {isEdit ? 'Update loan parameters or log return date' : 'Assign a book copy to a registered member'}
                    </p>
                </div>
                <Link
                    href="/borrowings"
                    className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
                >
                    Cancel
                </Link>
            </div>

            <div className="space-y-4">
                {/* Select Book */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Select Book <span className="text-rose-500">*</span>
                    </label>
                    <select
                        {...register('bookIsbn', { required: true })}
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 text-stone-100"
                    >
                        <option value="">-- Choose Book from Catalog --</option>
                        {books.map(b => (
                            <option key={b.isbn} value={b.isbn}>
                                {b.title} — by {b.author} ({b.isbn})
                            </option>
                        ))}
                    </select>
                    {errors.bookIsbn && <span className="text-rose-400 text-xs font-medium">Please select a book</span>}
                </div>

                {/* Select Member */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Select Member <span className="text-rose-500">*</span>
                    </label>
                    <select
                        {...register('memberId', { required: true })}
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 text-stone-100"
                    >
                        <option value="">-- Choose Member --</option>
                        {members.map(m => (
                            <option key={m.memberId} value={m.memberId}>
                                {m.fullName} ({m.memberId}) — {m.membershipType || 'Patron'}
                            </option>
                        ))}
                    </select>
                    {errors.memberId && <span className="text-rose-400 text-xs font-medium">Please select a member</span>}
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                            Borrow Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            {...register('borrowDate', { required: true })}
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                                Due Date <span className="text-rose-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={setFourteenDays}
                                className="text-[11px] text-amber-400 hover:underline font-medium"
                            >
                                +14 Days
                            </button>
                        </div>
                        <input
                            type="date"
                            {...register('dueDate', { required: true })}
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                        />
                    </div>
                </div>

                {/* Return Date (Optional/Edit) */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Return Date <span className="text-stone-500 font-normal">(Leave empty if active loan)</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            {...register('returnDate')}
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setValue('returnDate', todayStr)}
                            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 text-xs font-semibold shrink-0 border border-stone-700"
                        >
                            Mark Returned Today
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800/80">
                <Link
                    href="/borrowings"
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
                >
                    {isEdit ? 'Update Loan Record' : 'Issue Borrowing'}
                </button>
            </div>
        </form>
    );
}