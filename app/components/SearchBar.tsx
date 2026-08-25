'use client';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border border-[#3C2A21] rounded px-3 py-1.5 text-sm bg-[#E5E5CB] text-[#3C2A21] placeholder-[#3C2A21]/60 focus:outline-none focus:ring-2 focus:ring-[#1A120B]"
        />
    );
}