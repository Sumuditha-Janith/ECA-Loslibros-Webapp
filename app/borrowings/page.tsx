'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Borrowing, Book, Member } from '@/lib/types';
import SearchBar from '@/app/components/SearchBar';
import { useToast } from '@/app/components/Toast';
import ConfirmModal from '@/app/components/ConfirmModal';

export default function BorrowingsPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [books, setBooks] = useState<Record<string, Book>>({});
    const [members, setMembers] = useState<Record<string, Member>>({});
    const [filtered, setFiltered] = useState<Borrowing[]>([]);
    const [search, setSearch] = useState('');
    const [statusTab, setStatusTab] = useState<'ALL' | 'ACTIVE' | 'OVERDUE' | 'RETURNED'>('ALL');
    const [loading, setLoading] = useState(true);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const toast = useToast();
    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/borrowings'),
            api.get('/api/v1/books'),
            api.get('/api/v1/members'),
        ]).then(([borrowRes, bookRes, memberRes]) => {
            setBorrowings(borrowRes.data || []);

            const bookMap: Record<string, Book> = {};
            (bookRes.data || []).forEach((b: Book) => { bookMap[b.isbn] = b; });
            setBooks(bookMap);

            const memberMap: Record<string, Member> = {};
            (memberRes.data || []).forEach((m: Member) => { memberMap[m.memberId] = m; });
            setMembers(memberMap);

            setFiltered(borrowRes.data || []);
        }).catch(err => {
            console.error(err);
            toast.error('Failed to load borrowing records');
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        let result = borrowings.filter(b => {
            const bookTitle = books[b.bookIsbn]?.title?.toLowerCase() || '';
            const memberName = members[b.memberId]?.fullName?.toLowerCase() || '';
            return bookTitle.includes(q) ||
                memberName.includes(q) ||
                b.memberId.toLowerCase().includes(q) ||
                b.bookIsbn.includes(q) ||
                b.status.toLowerCase().includes(q);
        });

        if (statusTab === 'ACTIVE') {
            result = result.filter(b => b.status === 'BORROWED');
        } else if (statusTab === 'RETURNED') {
            result = result.filter(b => b.status === 'RETURNED');
        } else if (statusTab === 'OVERDUE') {
            result = result.filter(b => b.status === 'BORROWED' && b.dueDate < todayStr);
        }

        setFiltered(result);
    }, [search, statusTab, borrowings, books, members, todayStr]);

    // Quick Action: 1-Click Mark Returned
    const markAsReturned = (borrowingId: number) => {
        const payload = {
            returnDate: todayStr,
            status: 'RETURNED',
        };

        api.put(`/api/v1/borrowings/${borrowingId}`, payload)
            .then(() => {
                setBorrowings(prev => prev.map(b => b.borrowingId === borrowingId ? { ...b, returnDate: todayStr, status: 'RETURNED' } : b));
                toast.success('Book marked as returned successfully!');
            })
            .catch(() => toast.error('Failed to update loan status'));
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        const id = deleteId;
        setDeleteId(null);

        api.delete(`/api/v1/borrowings/${id}`)
            .then(() => {
                setBorrowings(prev => prev.filter(b => b.borrowingId !== id));
                toast.success('Borrowing record deleted');
            })
            .catch(() => toast.error('Failed to delete borrowing record'));
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3 shrink-0"></div>
            <p className="text-stone-400 text-sm font-medium">Loading circulation records...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-stone-800">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-[Outfit]">Book Borrowings Log</h1>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">Track active loans, return dates, and overdue alerts ({filtered.length} records)</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search book, member, status..." />
                    <Link
                        href="/borrowings/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] shrink-0 whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Issue Loan</span>
                    </Link>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => setStatusTab('ALL')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                        statusTab === 'ALL'
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                >
                    All Logs ({borrowings.length})
                </button>
                <button
                    onClick={() => setStatusTab('ACTIVE')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                        statusTab === 'ACTIVE'
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                >
                    Active Loans ({borrowings.filter(b => b.status === 'BORROWED').length})
                </button>
                <button
                    onClick={() => setStatusTab('OVERDUE')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                        statusTab === 'OVERDUE'
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-stone-900 border border-rose-900/40 text-rose-400 hover:bg-rose-950/30'
                    }`}
                >
                    Overdue ({borrowings.filter(b => b.status === 'BORROWED' && b.dueDate < todayStr).length})
                </button>
                <button
                    onClick={() => setStatusTab('RETURNED')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                        statusTab === 'RETURNED'
                            ? 'bg-emerald-500 text-stone-950 shadow-md'
                            : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                >
                    Returned ({borrowings.filter(b => b.status === 'RETURNED').length})
                </button>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="glass-panel p-12 text-center rounded-3xl border border-stone-800 my-8">
                    <svg className="w-12 h-12 shrink-0 text-stone-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-stone-200">No borrowing logs found</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">No circulation entries match your active tab filter.</p>
                </div>
            )}

            {/* Borrowings List */}
            <div className="grid grid-cols-1 gap-4">
                {filtered.map(b => {
                    const book = books[b.bookIsbn];
                    const member = members[b.memberId];
                    const isOverdue = b.status === 'BORROWED' && b.dueDate < todayStr;

                    return (
                        <div
                            key={b.borrowingId}
                            className={`glass-card p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                isOverdue ? 'border-rose-500/40 bg-rose-950/20' : 'border-stone-800'
                            }`}
                        >
                            {/* Book & Member Info */}
                            <div className="flex items-start sm:items-center gap-4">
                                <div className="w-12 h-16 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shrink-0 hidden sm:block">
                                    {book?.coverImageUrl ? (
                                        <img src={book.coverImageUrl} alt="Book" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-amber-950/40 flex items-center justify-center text-amber-500 font-bold text-[10px]">
                                            BOOK
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-bold text-stone-100 text-base">
                                            {book ? book.title : `Book: ${b.bookIsbn}`}
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shrink-0 ${
                                            b.status === 'RETURNED'
                                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                                                : isOverdue
                                                ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                                                : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                        }`}>
                                            {b.status === 'RETURNED' ? 'RETURNED' : isOverdue ? 'OVERDUE' : 'ACTIVE LOAN'}
                                        </span>
                                    </div>

                                    <p className="text-xs text-stone-300">
                                        Borrower: <span className="text-amber-400 font-medium">{member ? member.fullName : b.memberId}</span> ({b.memberId})
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-400 pt-1">
                                        <span className="whitespace-nowrap">Issue Date: <strong className="text-stone-200">{b.borrowDate}</strong></span>
                                        <span className="whitespace-nowrap">Due Date: <strong className={isOverdue ? 'text-rose-400 font-bold' : 'text-stone-200'}>{b.dueDate}</strong></span>
                                        {b.returnDate && <span className="whitespace-nowrap">Returned: <strong className="text-emerald-400">{b.returnDate}</strong></span>}
                                    </div>
                                </div>
                            </div>

                            {/* Actions & Buttons */}
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800 w-full md:w-auto justify-end">
                                {b.status === 'BORROWED' && (
                                    <button
                                        onClick={() => markAsReturned(b.borrowingId)}
                                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition whitespace-nowrap shrink-0"
                                    >
                                        ✓ Mark Returned
                                    </button>
                                )}

                                <Link
                                    href={`/borrowings/${b.borrowingId}/edit`}
                                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition whitespace-nowrap shrink-0"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => setDeleteId(b.borrowingId)}
                                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 transition shrink-0"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Borrowing Entry"
                message="Are you sure you want to remove this borrowing record from circulation log?"
                confirmText="Delete Record"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}