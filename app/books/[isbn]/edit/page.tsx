'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookForm from '@/app/components/BookForm';
import api, { apiMultipart } from '@/lib/api';
import { Book } from '@/lib/types';
import { useToast } from '@/app/components/Toast';

export default function EditBookPage() {
    const { isbn } = useParams();
    const router = useRouter();
    const toast = useToast();
    const [initialData, setInitialData] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/v1/books/${isbn}`)
            .then(res => setInitialData(res.data))
            .catch(() => toast.error('Book not found'))
            .finally(() => setLoading(false));
    }, [isbn]);

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
            await apiMultipart.put(`/api/v1/books/${isbn}`, formData);
            toast.success('Book updated successfully');
            router.push('/books');
        } catch (err) {
            toast.error('Failed to update book');
        }
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-400 text-sm">Loading book details...</p>
        </div>
    );

    if (!initialData) return <div className="py-12 text-center text-stone-400">Book not found</div>;

    return <BookForm initialData={initialData} onSubmit={handleSubmit} isEdit />;
}