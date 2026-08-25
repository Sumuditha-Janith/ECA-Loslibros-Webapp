'use client';
import MemberForm from '@/app/components/MemberForm';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/app/components/Toast';

export default function NewMemberPage() {
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (data: any) => {
        try {
            await api.post('/api/v1/members', data);
            toast.success('New member registered successfully');
            router.push('/members');
        } catch (err) {
            toast.error('Failed to register member');
        }
    };

    return <MemberForm onSubmit={handleSubmit} />;
}
