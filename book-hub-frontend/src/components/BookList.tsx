import { Grid, Container, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';
import BookCard from './BookCard';
import LoadingState from './LoadingState';
import type { Book } from '../types';
import api from '../api/axios';

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
export default function BookList({ 
  books, 
  isLoading,
  onBookUpdated
}: { 
  books: Book[];
  isLoading?: boolean;
  onBookUpdated?: () => void;
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editedBook, setEditedBook] = useState<Partial<Book>>({});
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    try {
      if (!selectedBook?._id) return;
      await api.put(`/books/${selectedBook._id}`, editedBook);
      setEditDialogOpen(false);
      setError(null);
      onBookUpdated?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedBook?._id) return;
      await api.delete(`/books/${selectedBook._id}`);
      setDeleteDialogOpen(false);
      setError(null);
      onBookUpdated?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <LoadingState type="book" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

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
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <BookCard 
              book={book} 
              onEdit={(book) => {
                setSelectedBook(book);
                setEditedBook(book);
                setEditDialogOpen(true);
              }}
              onDelete={(book) => {
                setSelectedBook(book);
                setDeleteDialogOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
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
            Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
