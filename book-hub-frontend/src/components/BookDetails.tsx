import { Card, CardContent, CardMedia, Typography, Chip, Box, Grid, Rating, Skeleton } from '@mui/material';
import type { Book } from '../types';

/**
 * BookDetails Component
 * 
 * Displays detailed information about a book in a responsive layout.
 * Handles null states and provides a clean UI for book information.
 * 
 * @param {Object} props - Component props
 * @param {Book | null} props.book - Book object to display details for
 * @returns {JSX.Element} A responsive card with book details
 */
export default function BookDetails({ book }: { book: Book | null }) {
  if (!book) {
    return (
      <Card sx={{ maxWidth: '100%', m: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            <Skeleton width="60%" />
          </Typography>
          <Skeleton width="40%" />
          <Skeleton height={100} />
        </CardContent>
      </Card>
    );
  }

  const authorNames = Array.isArray(book.authors) 
    ? book.authors.map(a => typeof a === 'string' ? a : a.name).join(', ') 
    : '';

  return (
    <Card sx={{ 
      maxWidth: '100%', 
      m: 2, 
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Grid container>
        {book.coverUrl && (
          <Grid item xs={12} sm={4} md={3}>
            <CardMedia
              component="img"
              image={book.coverUrl}
              alt={`${book.title} cover`}
              sx={{
                height: { xs: 200, sm: 300 },
                objectFit: 'contain',
                p: 2
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={book.coverUrl ? 8 : 12} md={book.coverUrl ? 9 : 12}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              By {authorNames}
            </Typography>
            {book.rating !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={book.rating} readOnly precision={0.5} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({book.rating})
                </Typography>
              </Box>
            )}
            <Box sx={{ mb: 2 }}>
              {book.genre.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>
            {book.publishedDate && (
              <Typography variant="body2" color="text.secondary">
                Published: {new Date(book.publishedDate).toLocaleDateString()}
              </Typography>
            )}
            {book.pages && (
              <Typography variant="body2" color="text.secondary">
                Pages: {book.pages}
              </Typography>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
