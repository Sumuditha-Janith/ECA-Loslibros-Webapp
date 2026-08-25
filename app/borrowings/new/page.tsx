'use client';
import BorrowingForm from '@/app/components/BorrowingForm';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function NewBorrowingPage() {
    const router = useRouter();
    const handleSubmit = async (data: any) => {
        try {
            await api.post('/api/v1/borrowings', data);
            router.push('/borrowings');
        } catch {
            alert('Failed to create borrowing');
        }
    };
    return <BorrowingForm onSubmit={handleSubmit} />;
}