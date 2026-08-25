'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BorrowingForm from '@/app/components/BorrowingForm';
import api from '@/lib/api';
import { Borrowing } from '@/lib/types';

export default function EditBorrowingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<Borrowing | null>(null);

    useEffect(() => {
        api.get(`/api/v1/borrowings/${id}`).then(res => setData(res.data));
    }, [id]);

    const handleSubmit = async (formData: any) => {
        try {
            await api.put(`/api/v1/borrowings/${id}`, formData);
            router.push('/borrowings');
        } catch {
            alert('Update failed');
        }
    };

    if (!data) return <div>Loading...</div>;
    return <BorrowingForm initialData={data} onSubmit={handleSubmit} isEdit />;
}