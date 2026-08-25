export interface Book {
    isbn: string;
    title: string;
    author: string;
    publisher?: string;
    publishedYear?: string;
    genre?: string;
    coverImageUrl?: string;
}

export interface BookRequest {
    isbn?: string;
    title: string;
    author: string;
    publisher?: string;
    publishedYear?: string;
    genre?: string;
    coverImage?: File | null;
}

export interface Member {
    memberId: string;
    fullName: string;
    email?: string;
    phone?: string;
    membershipType?: string;
    joinedDate?: string;
}

export interface MemberRequest {
    memberId?: string;
    fullName: string;
    email?: string;
    phone?: string;
    membershipType?: string;
    joinedDate?: string;
}

export interface Borrowing {
    borrowingId: number;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    bookIsbn: string;
    memberId: string;
    status: 'BORROWED' | 'RETURNED';
}

export interface BorrowingRequest {
    borrowDate: string;
    dueDate: string;
    returnDate?: string | null;
    bookIsbn: string;
    memberId: string;
}