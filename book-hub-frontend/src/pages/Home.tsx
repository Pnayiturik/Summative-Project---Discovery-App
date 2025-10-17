import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/useAuth';
import Pagination from '../components/Pagination';
import { setPage, setPageSize } from '../features/filters/filterSlice';
import type { RootState } from '../app/store';
import { setQuery, setSortBy } from '../features/filters/filterSlice';
import useBooks from '../hooks/useBooks';
import BookList from '../components/BookList';
import FilterPanel from '../components/FilterPanel';
import AddBookDialog from '../components/AddBookDialog';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const filters = useSelector((s: RootState) => s.filters);
  const { books, loading, error, refetch, totalBooks, totalPages, currentPage, pageSize } = useBooks();
  const [addBookOpen, setAddBookOpen] = useState(false);

  const handleAddBookClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setAddBookOpen(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Discover Books
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddBookClick}
        >
          Add Book
        </Button>
      </Box>
      
      <AddBookDialog
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onBookAdded={() => {
          refetch();
          setAddBookOpen(false);
        }}
      />
      
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <SearchBar
              value={filters.query}
              onChange={(value) => dispatch(setQuery(value))}
              suggestions={books.filter(book => 
                book.title.toLowerCase().includes(filters.query.toLowerCase()) ||
                book.authors.some(author => 
                  (typeof author === 'string' ? author : author.name)
                    .toLowerCase()
                    .includes(filters.query.toLowerCase())
                )
              )}
              loading={loading}
              sx={{ flexGrow: 1 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort by"
                onChange={(e) => dispatch(setSortBy(e.target.value as "date" | "rating" | "title"))}
              >
                <MenuItem value="date">Publication Date</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FilterPanel />
        </Paper>
      </Box>

      {error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">Error Loading Books</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{error}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Make sure the backend server is running on port 4000
          </Typography>
        </Box>
      ) : (
        <>
          <BookList books={books} isLoading={loading} onBookUpdated={refetch} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalBooks}
            onPageChange={(page) => dispatch(setPage(page))}
            onPageSizeChange={(size) => dispatch(setPageSize(size))}
          />
        </>
      )}
    </Container>
  );
}
