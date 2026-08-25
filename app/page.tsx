'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Book, Member, Borrowing } from '@/lib/types';

export default function LibraryDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/books'),
      api.get('/api/v1/members'),
      api.get('/api/v1/borrowings'),
    ])
      .then(([booksRes, membersRes, borrowRes]) => {
        setBooks(booksRes.data || []);
        setMembers(membersRes.data || []);
        setBorrowings(borrowRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeBorrowings = borrowings.filter((b) => b.status === 'BORROWED');
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueBorrowings = activeBorrowings.filter((b) => b.dueDate < todayStr);

  const bookMap = books.reduce<Record<string, Book>>((acc, b) => {
    acc[b.isbn] = b;
    return acc;
  }, {});

  const memberMap = members.reduce<Record<string, Member>>((acc, m) => {
    acc[m.memberId] = m;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3 shrink-0"></div>
        <p className="text-stone-400 text-sm font-medium">Loading Library Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-amber-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
              Live Management System
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 font-[Outfit] tracking-tight">
              Welcome to <span className="text-amber-500">LosLibros</span> Catalog
            </h1>
            <p className="text-stone-400 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
              Manage your collection of books, track active member circulation, issue new loans, and resolve return status with real-time tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/borrowings/new"
              className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/50 transition-all hover:scale-[1.02] shrink-0"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Issue New Loan</span>
            </Link>
            <Link
              href="/books/new"
              className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold text-sm bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all hover:scale-[1.02] shrink-0"
            >
              <span>+ Add Book</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Books */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Total Books</p>
            <h3 className="text-3xl font-extrabold text-stone-100 mt-1 font-[Outfit]">{books.length}</h3>
            <p className="text-xs text-amber-400/80 mt-1 font-medium whitespace-nowrap">In Library Catalog</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* Active Members */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Registered Members</p>
            <h3 className="text-3xl font-extrabold text-stone-100 mt-1 font-[Outfit]">{members.length}</h3>
            <p className="text-xs text-sky-400/80 mt-1 font-medium whitespace-nowrap">Active Library Patrons</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Active Borrowings */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Active Loans</p>
            <h3 className="text-3xl font-extrabold text-stone-100 mt-1 font-[Outfit]">{activeBorrowings.length}</h3>
            <p className="text-xs text-emerald-400/80 mt-1 font-medium whitespace-nowrap">Currently Checked Out</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Overdue Loans */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Overdue Items</p>
            <h3 className="text-3xl font-extrabold text-rose-400 mt-1 font-[Outfit]">{overdueBorrowings.length}</h3>
            <p className="text-xs text-rose-400/80 mt-1 font-medium whitespace-nowrap">Requires Attention</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Borrowings Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-stone-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-stone-100 font-[Outfit]">Active & Overdue Circulation</h2>
              <p className="text-xs text-stone-400">Live summary of books currently issued to members</p>
            </div>
            <Link href="/borrowings" className="text-xs font-semibold text-amber-400 hover:underline whitespace-nowrap shrink-0">
              View All ({borrowings.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {activeBorrowings.length === 0 ? (
              <p className="py-8 text-center text-stone-500 text-sm">No active borrowings recorded at the moment.</p>
            ) : (
              activeBorrowings.slice(0, 5).map((b) => {
                const book = bookMap[b.bookIsbn];
                const member = memberMap[b.memberId];
                const isOverdue = b.dueDate < todayStr;

                return (
                  <div
                    key={b.borrowingId}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      isOverdue
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 text-amber-400 border border-stone-700">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-100 text-sm">{book ? book.title : b.bookIsbn}</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Issued to: <span className="text-amber-400 font-medium">{member ? member.fullName : b.memberId}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-right shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] text-stone-400 whitespace-nowrap">Due: {b.dueDate}</p>
                        <span
                          className={`inline-flex items-center whitespace-nowrap mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isOverdue ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isOverdue ? 'OVERDUE' : 'ACTIVE LOAN'}
                        </span>
                      </div>

                      <Link
                        href={`/borrowings/${b.borrowingId}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition whitespace-nowrap shrink-0"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions & Featured Catalog */}
        <div className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-100 font-[Outfit]">Quick Shortcuts</h2>
            <p className="text-xs text-stone-400">Frequent administrative actions</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link
                href="/books/new"
                className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-800/60 transition group flex flex-col items-center text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition shrink-0 font-bold">
                  +
                </div>
                <span className="text-xs font-semibold text-stone-200 whitespace-nowrap">Add New Book</span>
              </Link>

              <Link
                href="/members/new"
                className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-800/60 transition group flex flex-col items-center text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition shrink-0 font-bold">
                  +
                </div>
                <span className="text-xs font-semibold text-stone-200 whitespace-nowrap">Register Member</span>
              </Link>

              <Link
                href="/books"
                className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-800/60 transition group flex flex-col items-center text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition shrink-0 text-base">
                  📚
                </div>
                <span className="text-xs font-semibold text-stone-200 whitespace-nowrap">Browse Catalog</span>
              </Link>

              <Link
                href="/borrowings"
                className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-800/60 transition group flex flex-col items-center text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition shrink-0 text-base">
                  📋
                </div>
                <span className="text-xs font-semibold text-stone-200 whitespace-nowrap">Borrowings Log</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800">
            <h3 className="text-sm font-bold text-stone-200 mb-3">Recently Added Books</h3>
            <div className="space-y-2">
              {books.slice(0, 3).map((b) => (
                <Link
                  key={b.isbn}
                  href={`/books/${b.isbn}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-900/80 transition"
                >
                  <div className="w-8 h-10 bg-amber-950/60 rounded border border-amber-800/40 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0">
                    BOOK
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-200 truncate">{b.title}</p>
                    <p className="text-[11px] text-stone-400 truncate">by {b.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}