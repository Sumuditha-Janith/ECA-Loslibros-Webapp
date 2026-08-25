'use client';
import BookForm from '@/app/components/BookForm';
import { useRouter } from 'next/navigation';
import api, { apiMultipart } from '@/lib/api';

export default function NewBookPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'coverImage' && data[key]) {
                formData.append(key, data[key]);
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        try {
            await apiMultipart.post('/api/v1/books', formData);
            router.push('/books');
        } catch (err) {
            alert('Failed to create book');
        }
    };

    return <BookForm onSubmit={handleSubmit} />;
}