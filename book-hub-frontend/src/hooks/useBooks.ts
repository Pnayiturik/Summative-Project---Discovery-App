import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api/axios';
import type { Book } from '../types';

export default function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  
  const filters = useSelector((state: RootState) => state.filters);
  const { query, genres, sortBy, page, pageSize } = filters;
  
  const refetch = () => setRefreshKey(key => key + 1);
  
  const totalPages = Math.ceil(totalBooks / pageSize);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Directly use the API to get better error handling
    api.get('/books', { 
      params: {
        query,
        genres: genres.join(','),
        sortBy,
        page,
        pageSize
      }
    })
      .then((response) => {
        if (!mounted) return;
        const { data, meta } = response.data;
        setBooks(data || []);
        setTotalBooks(meta?.total || 0);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
        setError(`Error: ${errorMessage}`);
        console.error('Error fetching books:', err);
        setBooks([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [query, genres, sortBy, refreshKey]);

  return { 
    books, 
    loading, 
    error, 
    refetch,
    totalBooks,
    totalPages,
    currentPage: page,
    pageSize
  };
}
