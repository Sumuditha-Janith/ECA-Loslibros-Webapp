'use client';
import BookForm from '@/app/components/BookForm';
import { useRouter } from 'next/navigation';
import { apiMultipart } from '@/lib/api';
import { useToast } from '@/app/components/Toast';

export default function NewBookPage() {
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'coverImage' && data[key] && data[key][0]) {
                formData.append(key, data[key][0]);
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        try {
            await apiMultipart.post('/api/v1/books', formData);
            toast.success('Book created successfully!');
            router.push('/books');
        } catch (err) {
            toast.error('Failed to create book');
        }
    };

    return <BookForm onSubmit={handleSubmit} />;
}