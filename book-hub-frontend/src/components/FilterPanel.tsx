import { Typography, List, ListItemButton, ListItemText, Chip, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleGenre } from '../features/filters/filterSlice';
import useBooks from '../hooks/useBooks';

const GENRES = [
  'All Books',
  'Fiction',
  'Classic',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Historical',
  'Romance',
  'Thriller',
  'Young Adult',
  'Adventure',
  'Dystopian'
];

export default function FilterPanel() {
  const dispatch = useDispatch();
  const selectedGenres = useSelector((s: RootState) => s.filters.genres);
  const { books } = useBooks();

  // Calculate genre counts from available books
  const genreCounts = books.reduce((counts: Record<string, number>, book) => {
    book.genre.forEach(g => {
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, {});

  const handleGenreClick = (genre: string) => {
    if (genre === 'All Books') {
      // Clear all filters
      selectedGenres.forEach(g => dispatch(toggleGenre(g)));
    } else {
      dispatch(toggleGenre(genre));
    }
  };

  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: 'primary.main' }}>
        Browse by Genre
      </Typography>
      <List sx={{ width: '100%' }}>
        {GENRES.map((genre) => (
          <ListItemButton
            key={genre}
            onClick={() => handleGenreClick(genre)}
            selected={genre === 'All Books' ? selectedGenres.length === 0 : selectedGenres.includes(genre)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemText 
              primary={genre} 
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: genre === 'All Books' ? 600 : 400
              }}
            />
            <Chip
              size="small"
              label={genre === 'All Books' ? books.length : (genreCounts[genre] || 0)}
              sx={{
                minWidth: 30,
                height: 20,
                fontSize: '0.75rem',
                bgcolor: selectedGenres.includes(genre) ? 'white' : 'primary.light',
                color: selectedGenres.includes(genre) ? 'primary.main' : 'white',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
