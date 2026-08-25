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
        defaultValues: initialData || { isbn: '', title: '', author: '', publisher: '', publishedYear: '', genre: '' },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-[#D5CEA3] p-6 rounded shadow-sm border border-[#3C2A21]">
            <h1 className="text-2xl font-bold text-[#1A120B] mb-4">{isEdit ? 'Edit Book' : 'Add Book'}</h1>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">ISBN</label>
                <input {...register('isbn', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" disabled={isEdit} />
                {errors.isbn && <span className="text-red-600 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Title</label>
                <input {...register('title', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
                {errors.title && <span className="text-red-600 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Author</label>
                <input {...register('author', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
                {errors.author && <span className="text-red-600 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Publisher</label>
                <input {...register('publisher')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Published Year</label>
                <input {...register('publishedYear')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Genre</label>
                <input {...register('genre')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-4">
                <label className="block font-medium text-sm text-[#3C2A21]">Cover Image</label>
                <input type="file" accept="image/*" {...register('coverImage')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Save</button>
        </form>
    );
}