import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// For multipart (book cover)
export const apiMultipart = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    headers: { 'Content-Type': 'multipart/form-data' },
});

export default api;