'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BorrowingForm from '@/app/components/BorrowingForm';
import api from '@/lib/api';
import { Borrowing } from '@/lib/types';

export default function EditBorrowingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<Borrowing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/borrowings/${id}`)
            .then(res => setInitialData(res.data))
            .catch(err => alert('Borrowing not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (data: any) => {
        try {
            await api.put(`/api/v1/borrowings/${id}`, data);
            router.push('/borrowings');
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return <div className="py-8 text-center">Loading...</div>;
    if (!initialData) return <div className="py-8 text-center">Borrowing not found</div>;

    return <BorrowingForm initialData={initialData} onSubmit={handleSubmit} isEdit />;
}