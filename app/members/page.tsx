'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Member } from '@/lib/types';
import SearchBar from '@/app/components/SearchBar';

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/api/v1/members')
            .then(res => {
                setMembers(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(members.filter(m =>
            m.fullName.toLowerCase().includes(q) ||
            m.memberId.toLowerCase().includes(q) ||
            (m.email && m.email.toLowerCase().includes(q))
        ));
    }, [search, members]);

    const deleteMember = (id: string) => {
        if (confirm('Delete this member?')) {
            api.delete(`/api/v1/members/${id}`)
                .then(() => {
                    const updated = members.filter(m => m.memberId !== id);
                    setMembers(updated);
                })
                .catch(err => alert('Delete failed'));
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h1 className="text-2xl font-bold text-[#1A120B]">Members</h1>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search members..." />
                    <Link href="/members/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition">
                        Add Member
                    </Link>
                </div>
            </div>
            <div className="grid gap-3">
                {filtered.map(m => (
                    <div key={m.memberId} className="bg-[#D5CEA3] border border-[#3C2A21] rounded p-4 flex flex-wrap items-center justify-between shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold text-[#1A120B]">{m.fullName}</h2>
                            <p className="text-[#3C2A21] text-sm">ID: {m.memberId} · {m.email || 'no email'}</p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <Link href={`/members/${m.memberId}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition">Edit</Link>
                            <button onClick={() => deleteMember(m.memberId)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition">Delete</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-[#3C2A21]">No members found.</p>}
            </div>
        </div>
    );
}