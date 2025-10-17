import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000, 
  validateStatus: (status) => status >= 200 && status < 500 
});


api.interceptors.request.use(config => {
  const raw = localStorage.getItem("bookhub_user");
  if (raw) {
    const user = JSON.parse(raw);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;

export async function fetchBooks(query?: string) {
  const res = await api.get('/books', { params: query ? { q: query } : undefined });
  return res.data;
}
