'use client';
import BorrowingForm from '@/app/components/BorrowingForm';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/app/components/Toast';

export default function NewBorrowingPage() {
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (data: any) => {
        try {
            await api.post('/api/v1/borrowings', data);
            toast.success('Book loan issued successfully');
            router.push('/borrowings');
        } catch {
            toast.error('Failed to issue borrowing loan');
        }
    };

    return <BorrowingForm onSubmit={handleSubmit} />;
}