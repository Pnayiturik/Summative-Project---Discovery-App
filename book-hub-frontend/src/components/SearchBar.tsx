import { useState, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '../hooks/useDebounce';
import type { Book } from '../types';

/**
 * Highlights the search query in the text
 * 
 * @param text - The text to highlight
 * @param query - The search query
 * @returns JSX with highlighted text
 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <Box
            key={i}
            component="span"
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              px: 0.5,
              borderRadius: 0.5
            }}
          >
            {part}
          </Box>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  suggestions?: Book[];
  loading?: boolean;
}

/**
 * SearchBar Component
 * 
 * A debounced search input with suggestions and highlighted matches.
 * Features:
 * - Debounced input to reduce API calls
 * - Search suggestions with highlighting
 * - Clear button for quick reset
 * - Loading state indicator
 */
export default function SearchBar({ 
  value, 
  onChange, 
  suggestions = [], 
  loading = false 
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder="Search books by title, author, or genre..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: localValue && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && localValue && (
        <Paper
          sx={{
            position: 'absolute',
            width: '100%',
            mt: 0.5,
            maxHeight: 300,
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: 3
          }}
        >
          <List>
            {loading ? (
              <ListItem>
                <ListItemText primary="Loading..." />
              </ListItem>
            ) : suggestions.length > 0 ? (
              suggestions.map((book) => (
                <ListItem 
                  key={book._id} 
                  button
                  onClick={() => {
                    setLocalValue(book.title);
                    onChange(book.title);
                    setShowSuggestions(false);
                  }}
                >
                  <ListItemText
                    primary={<HighlightText text={book.title} query={localValue} />}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          by <HighlightText 
                            text={book.authors.map(a => 
                              typeof a === 'string' ? a : a.name
                            ).join(', ')} 
                            query={localValue} 
                          />
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No matching books found" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
}
