import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex gap-6">
                <Link href="/books" className="font-semibold hover:text-blue-600">Books</Link>
                <Link href="/members" className="font-semibold hover:text-blue-600">Members</Link>
                <Link href="/borrowings" className="font-semibold hover:text-blue-600">Borrowings</Link>
            </div>
        </nav>
    );
}