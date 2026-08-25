'use client';
import { useForm } from 'react-hook-form';
import { MemberRequest, Member } from '@/lib/types';
import Link from 'next/link';

interface MemberFormProps {
    initialData?: Member | null;
    onSubmit: (data: MemberRequest) => void;
    isEdit?: boolean;
}

export default function MemberForm({ initialData, onSubmit, isEdit }: MemberFormProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<MemberRequest>({
        defaultValues: initialData || {
            memberId: `M-${Math.floor(100 + Math.random() * 900)}`,
            fullName: '',
            email: '',
            phone: '',
            membershipType: 'REGULAR',
            joinedDate: new Date().toISOString().split('T')[0],
        },
    });

    const generateId = () => {
        setValue('memberId', `M-${Math.floor(100 + Math.random() * 900)}`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-100 font-[Outfit]">
                        {isEdit ? 'Edit Member Profile' : 'Register New Member'}
                    </h1>
                    <p className="text-xs text-stone-400 mt-1">
                        {isEdit ? 'Update member details and contact information' : 'Create a library patron record for circulation'}
                    </p>
                </div>
                <Link
                    href="/members"
                    className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
                >
                    Cancel
                </Link>
            </div>

            <div className="space-y-4">
                {/* Member ID */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Member ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            {...register('memberId', { required: true })}
                            placeholder="e.g. M-101"
                            disabled={isEdit}
                            className={`w-full glass-input px-3.5 py-2.5 rounded-xl text-sm ${
                                isEdit ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                        {!isEdit && (
                            <button
                                type="button"
                                onClick={generateId}
                                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold shrink-0 border border-stone-700"
                            >
                                Auto ID
                            </button>
                        )}
                    </div>
                    {errors.memberId && <span className="text-rose-400 text-xs font-medium">Member ID is required</span>}
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        {...register('fullName', { required: true })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                    {errors.fullName && <span className="text-rose-400 text-xs font-medium">Full Name is required</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="eleanor@example.com"
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Phone Number</label>
                        <input
                            {...register('phone')}
                            placeholder="+1 (555) 000-0000"
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Membership Type */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Membership Tier</label>
                        <select
                            {...register('membershipType')}
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 text-stone-100"
                        >
                            <option value="REGULAR">Regular Member</option>
                            <option value="PREMIUM">Premium Member</option>
                            <option value="STUDENT">Student Tier</option>
                            <option value="FACULTY">Faculty Tier</option>
                        </select>
                    </div>

                    {/* Joined Date */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">Joined Date</label>
                        <input
                            type="date"
                            {...register('joinedDate')}
                            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800/80">
                <Link
                    href="/members"
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
                >
                    {isEdit ? 'Save Member' : 'Register Member'}
                </button>
            </div>
        </form>
    );
}