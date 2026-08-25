import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-[#D5CEA3] border-b border-[#3C2A21] py-3 px-4 shadow-sm">
            <div className="container mx-auto flex gap-6 font-medium text-[#3C2A21]">
                <Link href="/books" className="hover:text-[#1A120B] transition">Books</Link>
                <Link href="/members" className="hover:text-[#1A120B] transition">Members</Link>
                <Link href="/borrowings" className="hover:text-[#1A120B] transition">Borrowings</Link>
            </div>
        </nav>
    );
}