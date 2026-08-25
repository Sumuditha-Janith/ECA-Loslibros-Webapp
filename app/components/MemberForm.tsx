'use client';
import { useForm } from 'react-hook-form';
import { MemberRequest, Member } from '@/lib/types';

interface MemberFormProps {
    initialData?: Member | null;
    onSubmit: (data: MemberRequest) => void;
    isEdit?: boolean;
}

export default function MemberForm({ initialData, onSubmit, isEdit }: MemberFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<MemberRequest>({
        defaultValues: initialData || { memberId: '', fullName: '', email: '', phone: '', membershipType: '', joinedDate: '' },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Member' : 'Add Member'}</h1>
            <div className="mb-3">
                <label className="block font-medium text-sm">Member ID</label>
                <input {...register('memberId', { required: true })} className="w-full border border-gray-300 p-2 rounded" disabled={isEdit} />
                {errors.memberId && <span className="text-red-500 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm">Full Name</label>
                <input {...register('fullName', { required: true })} className="w-full border border-gray-300 p-2 rounded" />
                {errors.fullName && <span className="text-red-500 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm">Email</label>
                <input {...register('email')} className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm">Phone</label>
                <input {...register('phone')} className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm">Membership Type</label>
                <input {...register('membershipType')} className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm">Joined Date</label>
                <input {...register('joinedDate')} className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Save</button>
        </form>
    );
}