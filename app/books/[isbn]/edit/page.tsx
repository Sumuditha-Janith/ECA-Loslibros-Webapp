'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookForm from '@/app/components/BookForm';
import api, { apiMultipart } from '@/lib/api';
import { Book } from '@/lib/types';

export default function EditBookPage() {
    const { isbn } = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/books/${isbn}`)
            .then(res => setInitialData(res.data))
            .catch(err => alert('Book not found'))
            .finally(() => setLoading(false));
    }, [isbn]);

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
            await apiMultipart.put(`/api/v1/books/${isbn}`, formData);
            router.push('/books');
        } catch (err) {
            alert('Failed to update book');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!initialData) return <div>Book not found</div>;

    return <BookForm initialData={initialData} onSubmit={handleSubmit} isEdit />;
}