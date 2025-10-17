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
  const [totalPages, setTotalPages] = useState(0);
  
  const filters = useSelector((state: RootState) => state.filters);
  const { query, genres, sortBy, page, pageSize, authors, startDate, endDate } = filters;
  
  const refetch = () => setRefreshKey(key => key + 1);
  
  // totalPages is now managed by state

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchBooks = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        setError(null);

        const currentPage = Math.max(1, page);
        console.log('Fetching books with params:', {
          query,
          genres,
          authors,
          sortBy,
          page: currentPage,
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
            page: currentPage,
            pageSize: parseInt(pageSize.toString()),
            startDate: startDate || undefined,
            endDate: endDate || undefined
          }
        });
        
        console.log('Server response:', response.data);

        const { data, meta } = response.data;
        if (mounted) {
          setBooks(data || []);
          setTotalBooks(meta?.total || 0);
          setTotalPages(meta?.totalPages || 0);
          setError(null);
        }
      } catch (err: any) {
        if (!mounted) return;

        console.error('Error fetching books:', err);
        
        if ((err.message === 'Network Error' || err.code === 'ECONNREFUSED') && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(fetchBooks, 1000 * retryCount); // Exponential backoff
          return;
        }

        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
        setError(`Error: ${errorMessage}`);
        // Don't clear books on error unless it's a filter change
        if (query || genres.length || authors.length || startDate || endDate) {
          setBooks([]);
        }
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
