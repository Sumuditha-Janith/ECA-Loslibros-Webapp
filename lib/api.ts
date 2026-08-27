import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const apiMultipart = axios.create({
  baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 10000,
});

export default api;