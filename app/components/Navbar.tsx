import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm py-3 px-4">
            <div className="container mx-auto flex gap-6 font-medium">
                <Link href="/books" className="hover:text-blue-600 transition">Books</Link>
                <Link href="/members" className="hover:text-blue-600 transition">Members</Link>
                <Link href="/borrowings" className="hover:text-blue-600 transition">Borrowings</Link>
            </div>
        </nav>
    );
}