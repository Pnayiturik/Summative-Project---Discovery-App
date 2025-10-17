import { 
  Typography, 
  List, 
  ListItemButton, 
  ListItemText, 
  Chip, 
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleGenre, setAuthors, setDateRange } from '../features/filters/filterSlice';
import useBooks from '../hooks/useBooks';

/**
 * FilterPanel Component
 * 
 * Provides a responsive sidebar for filtering books by genre. Implements the following features:
 * - Genre selection with visual feedback
 * - Real-time book count per genre
 * - "All Books" option to clear filters
 * - Integration with Redux for filter state management
 * 
 * @returns {JSX.Element} A panel containing genre filter options
 */

// Constant array of available genres for type safety and reusability
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

  // Get unique authors from books
  const authors = Array.from(new Set(books.flatMap(book => 
    book.authors.map(a => typeof a === 'string' ? a : a.name)
  ))).sort();

  const selectedAuthors = useSelector((s: RootState) => s.filters.authors);
  const { startDate, endDate } = useSelector((s: RootState) => s.filters);

  const handleAuthorToggle = (author: string) => {
    const newAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter(a => a !== author)
      : [...selectedAuthors, author];
    dispatch(setAuthors(newAuthors));
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | null) => {
    dispatch(setDateRange({
      [type === 'start' ? 'startDate' : 'endDate']: date?.toISOString() || null
    }));
  };

  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
            Browse by Genre
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
            Filter by Author
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {authors.map((author) => (
              <FormControlLabel
                key={author}
                control={
                  <Checkbox
                    checked={selectedAuthors.includes(author)}
                    onChange={() => handleAuthorToggle(author)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {author} ({books.filter(b => 
                      b.authors.some(a => 
                        (typeof a === 'string' ? a : a.name) === author
                      )
                    ).length})
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
            Publication Date Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2, py: 1 }}>
            <DatePicker
              label="From Date"
              value={startDate ? new Date(startDate) : null}
              onChange={(date) => handleDateChange('start', date)}
              sx={{ mb: 2, width: '100%' }}
            />
            <DatePicker
              label="To Date"
              value={endDate ? new Date(endDate) : null}
              onChange={(date) => handleDateChange('end', date)}
              sx={{ width: '100%' }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
