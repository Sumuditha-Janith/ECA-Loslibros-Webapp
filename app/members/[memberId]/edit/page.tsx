'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MemberForm from '@/app/components/MemberForm';
import api from '@/lib/api';
import { Member } from '@/lib/types';
import { useToast } from '@/app/components/Toast';

export default function EditMemberPage() {
    const { memberId } = useParams();
    const router = useRouter();
    const toast = useToast();
    const [initialData, setInitialData] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/members/${memberId}`)
            .then(res => setInitialData(res.data))
            .catch(() => toast.error('Member not found'))
            .finally(() => setLoading(false));
    }, [memberId]);

    const handleSubmit = async (data: any) => {
        try {
            await api.put(`/api/v1/members/${memberId}`, data);
            toast.success('Member profile updated successfully');
            router.push('/members');
        } catch (err) {
            toast.error('Failed to update member');
        }
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-400 text-sm">Loading member profile...</p>
        </div>
    );

    if (!initialData) return <div className="py-12 text-center text-stone-400">Member not found</div>;

    return <MemberForm initialData={initialData} onSubmit={handleSubmit} isEdit />;
}