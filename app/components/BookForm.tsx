'use client';
import { useForm } from 'react-hook-form';
import { BookRequest, Book } from '@/lib/types';

interface BookFormProps {
    initialData?: Book | null;
    onSubmit: (data: any) => void;
    isEdit?: boolean;
}

export default function BookForm({ initialData, onSubmit, isEdit }: BookFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<BookRequest>({
        defaultValues: initialData || { isbn: '', title: '', author: '' },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Book' : 'Add Book'}</h1>
            <div className="mb-3">
                <label className="block font-medium">ISBN</label>
                <input {...register('isbn', { required: true })} className="w-full border p-2 rounded" disabled={isEdit} />
                {errors.isbn && <span className="text-red-500">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium">Title</label>
                <input {...register('title', { required: true })} className="w-full border p-2 rounded" />
                {errors.title && <span className="text-red-500">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium">Author</label>
                <input {...register('author', { required: true })} className="w-full border p-2 rounded" />
                {errors.author && <span className="text-red-500">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium">Publisher</label>
                <input {...register('publisher')} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium">Published Year</label>
                <input {...register('publishedYear')} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium">Genre</label>
                <input {...register('genre')} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium">Cover Image</label>
                <input type="file" accept="image/*" {...register('coverImage')} className="w-full border p-2 rounded" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
    );
}