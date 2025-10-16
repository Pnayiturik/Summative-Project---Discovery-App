import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api/axios';
import type { Book } from '../types';

export default function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const filters = useSelector((state: RootState) => state.filters);
  const { query, genres, sortBy } = filters;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Directly use the API to get better error handling
    api.get('/books', { 
      params: {
        query,
        genres: genres.join(','),
        sortBy
      }
    })
      .then((response) => {
        if (!mounted) return;
        const data = response.data?.data || [];
        setBooks(data);
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
  }, [query, genres, sortBy]);

  return { books, loading, error };
}
