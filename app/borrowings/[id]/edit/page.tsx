'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BorrowingForm from '@/app/components/BorrowingForm';
import api from '@/lib/api';
import { Borrowing } from '@/lib/types';
import { useToast } from '@/app/components/Toast';

export default function EditBorrowingPage() {
    const { id } = useParams();
    const router = useRouter();
    const toast = useToast();
    const [initialData, setInitialData] = useState<Borrowing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/borrowings/${id}`)
            .then(res => setInitialData(res.data))
            .catch(() => toast.error('Borrowing log not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (data: any) => {
        try {
            await api.put(`/api/v1/borrowings/${id}`, data);
            toast.success('Borrowing record updated');
            router.push('/borrowings');
        } catch (err) {
            toast.error('Failed to update borrowing record');
        }
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-400 text-sm">Loading circulation log...</p>
        </div>
    );

    if (!initialData) return <div className="py-12 text-center text-stone-400">Borrowing record not found</div>;

    return <BorrowingForm initialData={initialData} onSubmit={handleSubmit} isEdit />;
}