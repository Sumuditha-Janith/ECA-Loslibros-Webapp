'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Member } from '@/lib/types';

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    useEffect(() => {
        api.get('/api/v1/members').then(res => setMembers(res.data));
    }, []);

    const deleteMember = (id: string) => {
        if (confirm('Delete?')) {
            api.delete(`/api/v1/members/${id}`)
                .then(() => setMembers(members.filter(m => m.memberId !== id)));
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Members</h1>
                <Link href="/members/new" className="bg-blue-600 text-white px-4 py-2 rounded">Add Member</Link>
            </div>
            <div className="grid gap-4">
                {members.map(m => (
                    <div key={m.memberId} className="border p-4 rounded flex justify-between">
                        <div>
                            <h2 className="text-xl">{m.fullName}</h2>
                            <p>ID: {m.memberId} | {m.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/members/${m.memberId}/edit`} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</Link>
                            <button onClick={() => deleteMember(m.memberId)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}