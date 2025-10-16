import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Paper, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import type { RootState } from '../app/store';
import { setQuery, setSortBy } from '../features/filters/filterSlice';
import useBooks from '../hooks/useBooks';
import BookList from '../components/BookList';
import FilterPanel from '../components/FilterPanel';

export default function Home() {
  const dispatch = useDispatch();
  const filters = useSelector((s: RootState) => s.filters);
  const { books, loading, error } = useBooks();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Discover Books
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search books"
              variant="outlined"
              value={filters.query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              sx={{ flexGrow: 1 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort by"
                onChange={(e) => dispatch(setSortBy(e.target.value))}
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">Error Loading Books</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{error}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Make sure the backend server is running on port 4000
          </Typography>
        </Box>
      ) : (
        <BookList books={books} />
      )}
    </Container>
  );
}
