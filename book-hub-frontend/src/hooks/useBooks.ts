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
  const { query, genres, sortBy, page, pageSize, authors, startDate, endDate } = filters;
  
  const refetch = () => setRefreshKey(key => key + 1);
  
  const totalPages = Math.ceil(totalBooks / pageSize);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchBooks = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching books with params:', {
          query,
          genres,
          authors,
          sortBy,
          page,
          pageSize,
          startDate,
          endDate
        });

        const response = await api.get('/books', { 
          params: {
            query: query || undefined,
            genres: genres.length ? genres.join(',') : undefined,
            authors: authors.length ? authors.join(',') : undefined,
            sortBy,
            page,
            pageSize,
            startDate: startDate || undefined,
            endDate: endDate || undefined
          }
        });
        
        console.log('Server response:', response.data);

        const { data, meta } = response.data;
        if (mounted) {
          setBooks(data || []);
          setTotalBooks(meta?.total || 0);
          setError(null);
        }
      } catch (err: any) {
        if (!mounted) return;

        console.error('Error fetching books:', err);
        
        if (err.message === 'Network Error' && retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchBooks, 1000 * retryCount); // Exponential backoff
          return;
        }

        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
        setError(`Error: ${errorMessage}`);
        setBooks([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      mounted = false;
    };
  }, [query, genres, authors, sortBy, page, pageSize, startDate, endDate, refreshKey]);

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
