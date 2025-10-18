import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { Book } from '../types';
import api from '../api/axios';

interface AddBookDialogProps {
  open: boolean;
  onClose: () => void;
  onBookAdded: () => void;
}

const genres = [
  'Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Historical',
  'Adventure',
  'Classic',
  'Young Adult',
];

export default function AddBookDialog({ open, onClose, onBookAdded }: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    authors: [{ name: '', bio: '' }],
    genre: [] as string[],
    description: '',
    publishedDate: new Date(),
    rating: 0,
    coverUrl: '',
    pages: 0,
    isbn: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (formData.authors.some(a => !a.name.trim())) {
        throw new Error('All authors must have a name');
      }
      if (formData.genre.length === 0) {
        throw new Error('At least one genre must be selected');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.pages < 1) {
        throw new Error('Page count must be at least 1');
      }
      if (!formData.isbn.trim()) {
        throw new Error('ISBN is required');
      }

      const response = await api.post('/books', formData);
      
      if (!response.data) {
        throw new Error('Failed to add book - no response from server');
      }

      onBookAdded();
      onClose();
      // Reset form
      setFormData({
        title: '',
        authors: [{ name: '', bio: '' }],
        genre: [],
        description: '',
        publishedDate: new Date(),
        rating: 0,
        coverUrl: '',
        pages: 0,
        isbn: '',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add book';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      genre: event.target.value as string[],
    }));
  };

  const handleAuthorChange = (index: number, field: 'name' | 'bio', value: string) => {
    setFormData(prev => {
      const authors = [...prev.authors];
      authors[index] = { ...authors[index], [field]: value };
      return { ...prev, authors };
    });
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, { name: '', bio: '' }],
    }));
  };

  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Book</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Authors
          </Typography>
          {formData.authors.map((author, index) => (
            <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                label="Author Name"
                required
                value={author.name}
                onChange={e => handleAuthorChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Author Bio"
                value={author.bio}
                onChange={e => handleAuthorChange(index, 'bio', e.target.value)}
                sx={{ flex: 2 }}
              />
              {index > 0 && (
                <Button onClick={() => removeAuthor(index)} color="error">
                  Remove
                </Button>
              )}
            </Box>
          ))}
          <Button onClick={addAuthor} sx={{ mb: 2 }}>
            Add Another Author
          </Button>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Genres</InputLabel>
            <Select
              multiple
              value={formData.genre}
              onChange={handleGenreChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            required
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Publication Date"
              value={formData.publishedDate}
              onChange={(date) => setFormData(prev => ({ ...prev, publishedDate: date || new Date() }))}
              sx={{ mb: 2, width: '100%' }}
            />
          </LocalizationProvider>

          <TextField
            label="Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={formData.rating}
            onChange={e => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
            sx={{ mb: 2 }}
            fullWidth
          />

          <TextField
            label="Cover Image URL"
            fullWidth
            value={formData.coverUrl}
            onChange={e => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Page Count"
            type="number"
            required
            value={formData.pages}
            onChange={e => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) }))}
            sx={{ mb: 2 }}
            fullWidth
          />

          <TextField
            label="ISBN"
            required
            value={formData.isbn}
            onChange={e => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
            sx={{ mb: 2 }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}