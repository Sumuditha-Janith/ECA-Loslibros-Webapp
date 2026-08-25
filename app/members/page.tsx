'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Member, Borrowing } from '@/lib/types';
import SearchBar from '@/app/components/SearchBar';
import { useToast } from '@/app/components/Toast';
import ConfirmModal from '@/app/components/ConfirmModal';

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);

    const toast = useToast();

    useEffect(() => {
        Promise.all([
            api.get('/api/v1/members'),
            api.get('/api/v1/borrowings')
        ]).then(([memberRes, borrowRes]) => {
            setMembers(memberRes.data || []);
            setBorrowings(borrowRes.data || []);
            setFiltered(memberRes.data || []);
        }).catch(err => {
            console.error(err);
            toast.error('Failed to load library members');
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(members.filter(m =>
            m.fullName.toLowerCase().includes(q) ||
            m.memberId.toLowerCase().includes(q) ||
            (m.email && m.email.toLowerCase().includes(q)) ||
            (m.membershipType && m.membershipType.toLowerCase().includes(q))
        ));
    }, [search, members]);

    const activeLoansMap = borrowings
        .filter(b => b.status === 'BORROWED')
        .reduce<Record<string, number>>((acc, b) => {
            acc[b.memberId] = (acc[b.memberId] || 0) + 1;
            return acc;
        }, {});

    const confirmDelete = () => {
        if (!deleteMemberId) return;
        const id = deleteMemberId;
        setDeleteMemberId(null);

        api.delete(`/api/v1/members/${id}`)
            .then(() => {
                setMembers(prev => prev.filter(m => m.memberId !== id));
                toast.success('Member record deleted');
            })
            .catch(() => toast.error('Failed to delete member'));
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3 shrink-0"></div>
            <p className="text-stone-400 text-sm font-medium">Loading library members...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-stone-800">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-[Outfit]">Library Members</h1>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">Manage registered patrons, membership status, and loan quotas ({filtered.length} patrons)</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search name, ID, email..." />
                    <Link
                        href="/members/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] shrink-0 whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Add Member</span>
                    </Link>
                </div>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="glass-panel p-12 text-center rounded-3xl border border-stone-800 my-8">
                    <svg className="w-12 h-12 shrink-0 text-stone-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-stone-200">No members found</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">No registered library members match your filter criteria.</p>
                </div>
            )}

            {/* Members Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(m => {
                    const activeCount = activeLoansMap[m.memberId] || 0;
                    const initials = m.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                    const tierColors: Record<string, string> = {
                        PREMIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        FACULTY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                        STUDENT: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                        REGULAR: 'bg-stone-800 text-stone-300 border-stone-700',
                    };

                    const badgeStyle = tierColors[m.membershipType || 'REGULAR'] || tierColors.REGULAR;

                    return (
                        <div key={m.memberId} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 group">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-stone-950 font-bold text-lg flex items-center justify-center shadow-lg shadow-amber-950/50 shrink-0">
                                            {initials}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-stone-100 text-lg group-hover:text-amber-400 transition">
                                                {m.fullName}
                                            </h3>
                                            <p className="text-xs font-mono text-stone-400">ID: {m.memberId}</p>
                                        </div>
                                    </div>

                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap shrink-0 ${badgeStyle}`}>
                                        {m.membershipType || 'REGULAR'}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800/80">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 shrink-0 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{m.email || 'No email registered'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 shrink-0 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{m.phone || 'No phone registered'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0">
                                    <span className={`w-2 h-2 shrink-0 rounded-full ${activeCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-stone-600'}`}></span>
                                    <span className="text-stone-400 font-medium">
                                        {activeCount > 0 ? `${activeCount} Active Loans` : 'No Active Loans'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href={`/members/${m.memberId}`}
                                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition whitespace-nowrap shrink-0"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={`/members/${m.memberId}/edit`}
                                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition shrink-0"
                                        title="Edit"
                                    >
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={() => setDeleteMemberId(m.memberId)}
                                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 transition shrink-0"
                                        title="Delete"
                                    >
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={!!deleteMemberId}
                title="Delete Member Record"
                message="Are you sure you want to remove this member? Active borrowings associated with this member should be resolved first."
                confirmText="Delete Patron"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteMemberId(null)}
            />
        </div>
    );
}