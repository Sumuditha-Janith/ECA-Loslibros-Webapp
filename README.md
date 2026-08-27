# 💻 LosLibros - Library Management Web Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC.svg)](https://tailwindcss.com/)
[![Axios](https://img.shields.io/badge/Axios-1.x-purple.svg)](https://axios-http.com/)

The **Library Frontend** is a modern, responsive Single Page Application (SPA) web client for the LosLibros Library Management System. Built on **Next.js 16 (App Router)** and **React 19**, it communicates with backend microservices via the Spring Cloud API Gateway.

---

## 🌟 Features & Pages

- **📊 Central Dashboard (`/`)**:
  - Live system stats: Total books, active patrons, active/overdue loans.
  - Unified search across books, members, and borrowings.
  - Quick action shortcuts and recent activity feed.
- **📚 Books Management (`/books`)**:
  - Visual catalogue with cover image previews.
  - Add / edit books with multipart cover image upload.
  - Form validation with Zod and React Hook Form.
  - Safe deletion with confirmation modals.
- **👥 Members Directory (`/members`)**:
  - Patron directory with membership tiers (Standard, Premium, Student, etc.).
  - Register, update contact details, and remove member records.
- **📑 Circulation & Borrowing (`/borrowings`)**:
  - Issue loans linking books and patrons with automated due dates.
  - Single-click book return workflow.
  - Live status tracking (`BORROWED` vs `RETURNED`).
- **🎨 UI & Feedback Components**:
  - Custom Toast notification alerts (`Toast.tsx`).
  - Modal dialogues (`ConfirmModal.tsx`).
  - Fluid mobile-ready navigation bar (`Navbar.tsx`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## ⚙️ Environment Configuration

Create or modify `.env.local` in the `library-frontend/` directory to point to your API Gateway:

```env
# Spring Cloud API Gateway Endpoint (Port 7000)
NEXT_PUBLIC_API_BASE=http://localhost:7000
```

> **Note**: For cloud deployments, replace `http://localhost:7000` with the public IP / domain of your API Gateway.

---

## 📁 Directory Structure

```text
library-frontend/
├── app/
│   ├── books/              # Books list and management view
│   ├── borrowings/         # Borrowing records and return actions
│   ├── members/            # Member directory view
│   ├── components/         # Reusable UI components
│   │   ├── BookForm.tsx
│   │   ├── BorrowingForm.tsx
│   │   ├── MemberForm.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchBar.tsx
│   │   └── Toast.tsx
│   ├── globals.css         # Tailwind CSS v4 styling rules
│   ├── layout.tsx          # Root layout and theme wrapper
│   └── page.tsx            # Main interactive dashboard
├── lib/
│   ├── api.ts              # Axios HTTP client configuration
│   └── types.ts            # TypeScript interfaces (Book, Member, Borrowing)
├── public/                 # Static assets & favicon
├── .env.local              # Local environment variables
└── package.json            # Project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd library-frontend
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 👤 Student Information

- **Student Name:** E. Sumuditha Janith
- **Student Number:** 241711016
- **GCP Project ID:** eca-gdse-71-loslibros
- **Slack Handle:** https://ijse-eca-hdse-71-72.slack.com/team/U0BF55V8V0W

