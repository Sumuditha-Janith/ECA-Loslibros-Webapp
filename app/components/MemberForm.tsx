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
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-[#D5CEA3] p-6 rounded shadow-sm border border-[#3C2A21]">
            <h1 className="text-2xl font-bold text-[#1A120B] mb-4">{isEdit ? 'Edit Member' : 'Add Member'}</h1>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Member ID</label>
                <input {...register('memberId', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" disabled={isEdit} />
                {errors.memberId && <span className="text-red-600 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Full Name</label>
                <input {...register('fullName', { required: true })} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
                {errors.fullName && <span className="text-red-600 text-sm">Required</span>}
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Email</label>
                <input {...register('email')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Phone</label>
                <input {...register('phone')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-3">
                <label className="block font-medium text-sm text-[#3C2A21]">Membership Type</label>
                <input {...register('membershipType')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <div className="mb-4">
                <label className="block font-medium text-sm text-[#3C2A21]">Joined Date</label>
                <input {...register('joinedDate')} className="w-full border border-[#3C2A21] bg-[#E5E5CB] p-2 rounded text-[#3C2A21]" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Save</button>
        </form>
    );
}