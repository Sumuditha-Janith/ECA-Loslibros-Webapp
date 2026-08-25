'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MemberForm from '@/app/components/MemberForm';
import api from '@/lib/api';
import { Member } from '@/lib/types';

export default function EditMemberPage() {
    const { memberId } = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/members/${memberId}`)
            .then(res => setInitialData(res.data))
            .catch(err => alert('Member not found'))
            .finally(() => setLoading(false));
    }, [memberId]);

    const handleSubmit = async (data: any) => {
        try {
            await api.put(`/api/v1/members/${memberId}`, data);
            router.push('/members');
        } catch (err) {
            alert('Failed to update member');
        }
    };

    if (loading) return <div className="py-8 text-center">Loading...</div>;
    if (!initialData) return <div className="py-8 text-center">Member not found</div>;

    return <MemberForm initialData={initialData} onSubmit={handleSubmit} isEdit />;
}