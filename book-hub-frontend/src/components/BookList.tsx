import { Grid, Container, Typography, Box } from '@mui/material';
import BookCard from './BookCard';
import type { Book } from '../types';

/**
 * BookList Component
 * 
 * Displays a responsive grid of book cards. Handles empty states and responsive layouts
 * for different screen sizes using Material-UI's Grid system.
 * 
 * @param {Object} props - Component props
 * @param {Book[]} props.books - Array of book objects to display
 * @returns {JSX.Element} A grid of book cards or an empty state message
 */
export default function BookList({ books }: { books: Book[] }) {
  if (!books.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No books found
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
