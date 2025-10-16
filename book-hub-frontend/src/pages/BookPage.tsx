import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Rating,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import api from '../api/axios';
import type { Book } from '../types';

export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Book not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Back to Books
      </Button>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={book.coverUrl || 'https://via.placeholder.com/300x450?text=No+Cover'}
              alt={book.title}
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.authors.map(a => typeof a === 'string' ? a : a.name).join(', ')}
            </Typography>

            {book.rating && (
              <Box sx={{ my: 2 }}>
                <Rating value={book.rating} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  ({book.rating})
                </Typography>
              </Box>
            )}

            <Box sx={{ my: 2 }}>
              {book.genre.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            {book.description && (
              <Typography variant="body1" paragraph>
                {book.description}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {book.publishedDate && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Published
                  </Typography>
                  <Typography variant="body1">
                    {new Date(book.publishedDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}

              {book.pages && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Pages
                  </Typography>
                  <Typography variant="body1">
                    {book.pages}
                  </Typography>
                </Grid>
              )}

              {book.isbn && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    ISBN
                  </Typography>
                  <Typography variant="body1">
                    {book.isbn}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
