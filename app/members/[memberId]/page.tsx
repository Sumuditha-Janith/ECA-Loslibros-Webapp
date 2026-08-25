'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Member, Borrowing, Book } from '@/lib/types';
import { useToast } from '@/app/components/Toast';

export default function MemberDetailPage() {
    const { memberId } = useParams();
    const [member, setMember] = useState<Member | null>(null);
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [books, setBooks] = useState<Record<string, Book>>({});
    const [loading, setLoading] = useState(true);

    const toast = useToast();

    useEffect(() => {
        Promise.all([
            api.get(`/api/v1/members/${memberId}`),
            api.get('/api/v1/borrowings'),
            api.get('/api/v1/books')
        ]).then(([memberRes, borrowRes, bookRes]) => {
            setMember(memberRes.data);
            const memberBorrowings = (borrowRes.data || []).filter((b: Borrowing) => b.memberId === memberId);
            setBorrowings(memberBorrowings);

            const map: Record<string, Book> = {};
            (bookRes.data || []).forEach((b: Book) => { map[b.isbn] = b; });
            setBooks(map);
        }).catch(() => toast.error('Member details not found'))
        .finally(() => setLoading(false));
    }, [memberId]);

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-400 text-sm font-medium">Fetching member profile...</p>
        </div>
    );

    if (!member) return (
        <div className="glass-panel p-12 text-center rounded-3xl border border-stone-800 my-8">
            <h2 className="text-xl font-bold text-stone-200">Member Not Found</h2>
            <p className="text-xs text-stone-400 mt-2 mb-4">No patron profile matching ID {memberId} exists.</p>
            <Link href="/members" className="px-4 py-2 bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold">
                ← Back to Members
            </Link>
        </div>
    );

    const activeLoans = borrowings.filter(b => b.status === 'BORROWED');
    const returnedLoans = borrowings.filter(b => b.status === 'RETURNED');
    const initials = member.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <Link
                    href="/members"
                    className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-100 text-xs font-semibold transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Members Directory
                </Link>

                <Link
                    href={`/members/${memberId}/edit`}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold transition"
                >
                    Edit Member Profile
                </Link>
            </div>

            {/* Profile Header Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-extrabold text-2xl flex items-center justify-center shadow-xl shadow-amber-950/50 shrink-0">
                    {initials}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-[Outfit]">{member.fullName}</h1>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {member.membershipType || 'REGULAR'}
                        </span>
                    </div>

                    <p className="text-xs font-mono text-stone-400">Patron ID: {member.memberId} {member.joinedDate ? `· Joined ${member.joinedDate}` : ''}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-3 text-xs text-stone-300">
                        <div>
                            <span className="text-stone-500">Email:</span>{' '}
                            <span className="font-semibold text-stone-200">{member.email || '—'}</span>
                        </div>
                        <div>
                            <span className="text-stone-500">Phone:</span>{' '}
                            <span className="font-semibold text-stone-200">{member.phone || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Borrowed Books */}
            <div className="glass-panel p-6 rounded-3xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-stone-100 font-[Outfit]">Currently Borrowed Books</h2>
                        <p className="text-xs text-stone-400">Active loans checked out by this patron ({activeLoans.length})</p>
                    </div>

                    <Link
                        href="/borrowings/new"
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold shadow-md hover:bg-amber-400 transition"
                    >
                        + Issue Book to Patron
                    </Link>
                </div>

                {activeLoans.length === 0 ? (
                    <p className="py-6 text-center text-stone-500 text-xs">No active books currently borrowed by this member.</p>
                ) : (
                    <div className="space-y-3">
                        {activeLoans.map(b => {
                            const book = books[b.bookIsbn];
                            return (
                                <div key={b.borrowingId} className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-stone-100 text-sm">{book ? book.title : b.bookIsbn}</h4>
                                        <p className="text-xs text-stone-400 mt-0.5">Borrowed: {b.borrowDate} · Due: <span className="text-amber-400 font-semibold">{b.dueDate}</span></p>
                                    </div>
                                    <Link
                                        href={`/borrowings/${b.borrowingId}/edit`}
                                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition"
                                    >
                                        Manage Loan
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Returned History */}
            {returnedLoans.length > 0 && (
                <div className="glass-panel p-6 rounded-3xl border border-stone-800 space-y-4">
                    <h3 className="text-base font-bold text-stone-100 font-[Outfit]">Loan History ({returnedLoans.length} Returned)</h3>
                    <div className="divide-y divide-stone-800">
                        {returnedLoans.map(b => {
                            const book = books[b.bookIsbn];
                            return (
                                <div key={b.borrowingId} className="py-2.5 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-semibold text-stone-200">{book ? book.title : b.bookIsbn}</span>
                                        <span className="text-stone-500 ml-2">Returned on {b.returnDate || '—'}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                                        RETURNED
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
