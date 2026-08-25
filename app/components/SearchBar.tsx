'use client';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search books, members...' }: SearchBarProps) {
    return (
        <div className="relative flex items-center w-full sm:w-80 shrink-0">
            <svg className="w-4 h-4 shrink-0 text-stone-400 absolute left-3.5 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full glass-input !pl-10 !pr-9 rounded-xl text-sm placeholder:text-stone-500 font-medium transition-all"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-3 p-1 text-stone-400 hover:text-stone-200 rounded-md transition shrink-0 z-10"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}