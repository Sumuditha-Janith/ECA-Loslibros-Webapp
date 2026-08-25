'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BookRequest, Book } from '@/lib/types';
import Link from 'next/link';

interface BookFormProps {
    initialData?: Book | null;
    onSubmit: (data: any) => void;
    isEdit?: boolean;
}

export default function BookForm({ initialData, onSubmit, isEdit }: BookFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.coverImageUrl || null);
    const { register, handleSubmit, formState: { errors } } = useForm<BookRequest>({
        defaultValues: initialData || { isbn: '', title: '', author: '', publisher: '', publishedYear: '', genre: '' },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-100 font-[Outfit]">
                        {isEdit ? 'Edit Book Details' : 'Add New Book'}
                    </h1>
                    <p className="text-xs text-stone-400 mt-1">
                        {isEdit ? 'Update metadata for this catalog item' : 'Register a new publication into the library system'}
                    </p>
                </div>
                <Link
                    href="/books"
                    className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
                >
                    Cancel
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ISBN */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        ISBN Identifier <span className="text-rose-500">*</span>
                    </label>
                    <input
                        {...register('isbn', { required: true })}
                        placeholder="e.g. 978-0141439518"
                        disabled={isEdit}
                        className={`w-full glass-input px-3.5 py-2.5 rounded-xl text-sm ${
                            isEdit ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    />
                    {errors.isbn && <span className="text-rose-400 text-xs font-medium">ISBN is required</span>}
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Book Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                        {...register('title', { required: true })}
                        placeholder="e.g. Pride and Prejudice"
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                    {errors.title && <span className="text-rose-400 text-xs font-medium">Title is required</span>}
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Author Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        {...register('author', { required: true })}
                        placeholder="e.g. Jane Austen"
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                    {errors.author && <span className="text-rose-400 text-xs font-medium">Author is required</span>}
                </div>

                {/* Publisher */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Publisher</label>
                    <input
                        {...register('publisher')}
                        placeholder="e.g. Penguin Classics"
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                </div>

                {/* Published Year */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Published Year</label>
                    <input
                        {...register('publishedYear')}
                        placeholder="e.g. 1813"
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                </div>

                {/* Genre */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Genre Category</label>
                    <input
                        {...register('genre')}
                        placeholder="e.g. Fiction, History, Science"
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                </div>
            </div>

            {/* Cover Image Upload & Live Preview */}
            <div className="space-y-2 pt-2 border-t border-stone-800/80">
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Book Cover Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {previewUrl ? (
                        <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-stone-700 shrink-0 bg-stone-900">
                            <img src={previewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-32 rounded-xl border border-dashed border-stone-700 bg-stone-900/50 flex flex-col items-center justify-center text-stone-500 shrink-0">
                            <svg className="w-8 h-8 mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px]">No image</span>
                        </div>
                    )}

                    <div className="flex-1 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            {...register('coverImage')}
                            onChange={(e) => {
                                register('coverImage').onChange(e);
                                handleFileChange(e);
                            }}
                            className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 glass-input cursor-pointer"
                        />
                        <p className="text-[11px] text-stone-500 mt-1">Accepts PNG, JPG, WebP up to 5MB.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800/80">
                <Link
                    href="/books"
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
                >
                    {isEdit ? 'Save Changes' : 'Create Book'}
                </button>
            </div>
        </form>
    );
}