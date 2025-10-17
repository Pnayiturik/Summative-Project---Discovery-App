import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // Reduced timeout for faster error feedback
  validateStatus: (status) => status >= 200 && status < 500 
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    if (!error.response) {
      throw new Error('Network error - Please check if the backend server is running on port 4000');
    }
    throw error;
  }
);


api.interceptors.request.use(config => {
  const raw = localStorage.getItem("bookhub_user");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data && data.token) {
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${data.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

export default api;

export async function fetchBooks(query?: string) {
  const res = await api.get('/books', { params: query ? { q: query } : undefined });
  return res.data;
}
