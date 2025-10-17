import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Box, 
  Grid, 
  Rating, 
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types';
import { useAuth } from '../hooks';
import api from '../api/axios';

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
interface BookDetailsProps {
  book: Book | null;
  onBookUpdated?: () => void;
}

export default function BookDetails({ book, onBookUpdated }: BookDetailsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedBook, setEditedBook] = useState<Partial<Book>>({});
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEdit = async () => {
    try {
      if (!book?._id) return;
      await api.put(`/books/${book._id}`, editedBook);
      setEditDialogOpen(false);
      setError(null);
      onBookUpdated?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDelete = async () => {
    try {
      if (!book?._id) return;
      await api.delete(`/books/${book._id}`);
      setDeleteDialogOpen(false);
      setError(null);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const isOwner = user && book?.createdBy === user._id;
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
    <>
      <Card sx={{ 
        maxWidth: '100%', 
        m: 2, 
        borderRadius: 2,
        boxShadow: 3,
        position: 'relative'
      }}>
        {isOwner && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1, zIndex: 1 }}>
            <IconButton onClick={() => {
              setEditedBook(book || {});
              setEditDialogOpen(true);
            }}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        <Grid container spacing={2}>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Title"
            fullWidth
            value={editedBook.title || ''}
            onChange={(e) => setEditedBook(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editedBook.description || ''}
            onChange={(e) => setEditedBook(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={editedBook.rating || ''}
            onChange={(e) => setEditedBook(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Cover URL"
            fullWidth
            value={editedBook.coverUrl || ''}
            onChange={(e) => setEditedBook(prev => ({ ...prev, coverUrl: e.target.value }))}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{book?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
