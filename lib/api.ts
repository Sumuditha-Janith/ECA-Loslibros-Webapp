import axios from 'axios';
import { Book, Member, Borrowing } from './types';

// Mock initial data for offline preview mode
const MOCK_BOOKS: Book[] = [
  {
    isbn: '978-0141439518',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publisher: 'Penguin Classics',
    publishedYear: '1813',
    genre: 'Classic Literature',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  },
  {
    isbn: '978-0743273565',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publisher: 'Scribner',
    publishedYear: '1925',
    genre: 'Classic Fiction',
    coverImageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
  },
  {
    isbn: '978-0451524935',
    title: '1984',
    author: 'George Orwell',
    publisher: 'Signet Classic',
    publishedYear: '1949',
    genre: 'Dystopian Fiction',
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  },
  {
    isbn: '978-0345391803',
    title: "The Hitchhiker's Guide to the Galaxy",
    author: 'Douglas Adams',
    publisher: 'Del Rey',
    publishedYear: '1979',
    genre: 'Sci-Fi Comedy',
    coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
  },
  {
    isbn: '978-0061120084',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publisher: 'Harper Perennial',
    publishedYear: '1960',
    genre: 'Fiction',
    coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
  },
];

const MOCK_MEMBERS: Member[] = [
  {
    memberId: 'M-101',
    fullName: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 234-5678',
    membershipType: 'PREMIUM',
    joinedDate: '2024-01-15',
  },
  {
    memberId: 'M-102',
    fullName: 'Julian Blackwood',
    email: 'julian.b@example.com',
    phone: '+1 (555) 876-5432',
    membershipType: 'STUDENT',
    joinedDate: '2024-03-20',
  },
  {
    memberId: 'M-103',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 (555) 345-6789',
    membershipType: 'FACULTY',
    joinedDate: '2023-11-05',
  },
];

const MOCK_BORROWINGS: Borrowing[] = [
  {
    borrowingId: 1001,
    bookIsbn: '978-0141439518',
    memberId: 'M-101',
    borrowDate: '2026-08-10',
    dueDate: '2026-08-24',
    returnDate: null,
    status: 'BORROWED',
  },
  {
    borrowingId: 1002,
    bookIsbn: '978-0451524935',
    memberId: 'M-102',
    borrowDate: '2026-08-01',
    dueDate: '2026-08-15',
    returnDate: null,
    status: 'BORROWED',
  },
  {
    borrowingId: 1003,
    bookIsbn: '978-0743273565',
    memberId: 'M-103',
    borrowDate: '2026-07-15',
    dueDate: '2026-07-29',
    returnDate: '2026-07-28',
    status: 'RETURNED',
  },
];

// Memory store helpers
const getStored = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  try {
    const item = localStorage.getItem(`loslibros_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch {
    return initial;
  }
};

const setStored = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`loslibros_${key}`, JSON.stringify(data));
  } catch {}
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 3000,
});

export const apiMultipart = axios.create({
  baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 3000,
});

// Fallback Mock Handler on network error
const handleMockResponse = (error: any) => {
  if (!error.config) return Promise.reject(error);

  const url = error.config.url || '';
  const method = (error.config.method || 'get').toLowerCase();

  console.warn(`[API Offline Fallback] Handling ${method.toUpperCase()} ${url} with local mock engine.`);

  // Books endpoints
  if (url.includes('/api/v1/books')) {
    let books = getStored<Book[]>('books', MOCK_BOOKS);
    const parts = url.split('/api/v1/books');
    const isbnParam = parts[1] ? parts[1].replace(/^\//, '') : '';

    if (method === 'get') {
      if (isbnParam) {
        const book = books.find((b) => b.isbn === isbnParam);
        return book ? Promise.resolve({ data: book, status: 200 }) : Promise.reject(new Error('Book not found'));
      }
      return Promise.resolve({ data: books, status: 200 });
    }

    if (method === 'post') {
      let newBook: any = {};
      if (error.config.data instanceof FormData) {
        error.config.data.forEach((val: any, key: string) => {
          if (key !== 'coverImage') newBook[key] = val;
        });
      } else if (typeof error.config.data === 'string') {
        try { newBook = JSON.parse(error.config.data); } catch {}
      } else {
        newBook = error.config.data || {};
      }
      const created: Book = {
        isbn: newBook.isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
        title: newBook.title || 'Untitled Book',
        author: newBook.author || 'Unknown Author',
        publisher: newBook.publisher || '',
        publishedYear: newBook.publishedYear || new Date().getFullYear().toString(),
        genre: newBook.genre || 'General',
        coverImageUrl: newBook.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
      };
      books = [created, ...books];
      setStored('books', books);
      return Promise.resolve({ data: created, status: 201 });
    }

    if (method === 'put') {
      let updatedData: any = {};
      if (error.config.data instanceof FormData) {
        error.config.data.forEach((val: any, key: string) => {
          if (key !== 'coverImage') updatedData[key] = val;
        });
      } else if (typeof error.config.data === 'string') {
        try { updatedData = JSON.parse(error.config.data); } catch {}
      } else {
        updatedData = error.config.data || {};
      }
      books = books.map((b) => (b.isbn === isbnParam ? { ...b, ...updatedData } : b));
      setStored('books', books);
      const target = books.find((b) => b.isbn === isbnParam);
      return Promise.resolve({ data: target, status: 200 });
    }

    if (method === 'delete') {
      books = books.filter((b) => b.isbn !== isbnParam);
      setStored('books', books);
      return Promise.resolve({ data: { message: 'Deleted' }, status: 200 });
    }
  }

  // Members endpoints
  if (url.includes('/api/v1/members')) {
    let members = getStored<Member[]>('members', MOCK_MEMBERS);
    const parts = url.split('/api/v1/members');
    const memberIdParam = parts[1] ? parts[1].replace(/^\//, '') : '';

    if (method === 'get') {
      if (memberIdParam) {
        const m = members.find((item) => item.memberId === memberIdParam);
        return m ? Promise.resolve({ data: m, status: 200 }) : Promise.reject(new Error('Member not found'));
      }
      return Promise.resolve({ data: members, status: 200 });
    }

    if (method === 'post') {
      let payload: any = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
      const newMember: Member = {
        memberId: payload.memberId || `M-${Math.floor(100 + Math.random() * 900)}`,
        fullName: payload.fullName || 'New Member',
        email: payload.email || '',
        phone: payload.phone || '',
        membershipType: payload.membershipType || 'REGULAR',
        joinedDate: payload.joinedDate || new Date().toISOString().split('T')[0],
      };
      members = [newMember, ...members];
      setStored('members', members);
      return Promise.resolve({ data: newMember, status: 201 });
    }

    if (method === 'put') {
      let payload: any = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
      members = members.map((m) => (m.memberId === memberIdParam ? { ...m, ...payload } : m));
      setStored('members', members);
      const target = members.find((m) => m.memberId === memberIdParam);
      return Promise.resolve({ data: target, status: 200 });
    }

    if (method === 'delete') {
      members = members.filter((m) => m.memberId !== memberIdParam);
      setStored('members', members);
      return Promise.resolve({ data: { message: 'Deleted' }, status: 200 });
    }
  }

  // Borrowings endpoints
  if (url.includes('/api/v1/borrowings')) {
    let borrowings = getStored<Borrowing[]>('borrowings', MOCK_BORROWINGS);
    const parts = url.split('/api/v1/borrowings');
    const idParam = parts[1] ? parts[1].replace(/^\//, '') : '';

    if (method === 'get') {
      if (idParam) {
        const b = borrowings.find((item) => item.borrowingId.toString() === idParam);
        return b ? Promise.resolve({ data: b, status: 200 }) : Promise.reject(new Error('Borrowing record not found'));
      }
      return Promise.resolve({ data: borrowings, status: 200 });
    }

    if (method === 'post') {
      let payload: any = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
      const newBorrowing: Borrowing = {
        borrowingId: Math.floor(1000 + Math.random() * 9000),
        bookIsbn: payload.bookIsbn,
        memberId: payload.memberId,
        borrowDate: payload.borrowDate || new Date().toISOString().split('T')[0],
        dueDate: payload.dueDate,
        returnDate: payload.returnDate || null,
        status: payload.returnDate ? 'RETURNED' : 'BORROWED',
      };
      borrowings = [newBorrowing, ...borrowings];
      setStored('borrowings', borrowings);
      return Promise.resolve({ data: newBorrowing, status: 201 });
    }

    if (method === 'put') {
      let payload: any = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
      borrowings = borrowings.map((b) => {
        if (b.borrowingId.toString() === idParam) {
          const updatedStatus = payload.returnDate ? 'RETURNED' : (payload.status || b.status);
          return { ...b, ...payload, status: updatedStatus };
        }
        return b;
      });
      setStored('borrowings', borrowings);
      const target = borrowings.find((b) => b.borrowingId.toString() === idParam);
      return Promise.resolve({ data: target, status: 200 });
    }

    if (method === 'delete') {
      borrowings = borrowings.filter((b) => b.borrowingId.toString() !== idParam);
      setStored('borrowings', borrowings);
      return Promise.resolve({ data: { message: 'Deleted' }, status: 200 });
    }
  }

  return Promise.reject(error);
};

api.interceptors.response.use((res) => res, handleMockResponse);
apiMultipart.interceptors.response.use((res) => res, handleMockResponse);

export default api;