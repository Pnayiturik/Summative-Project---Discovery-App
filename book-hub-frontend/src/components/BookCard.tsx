import { Card, CardContent, CardMedia, Typography, Rating, Chip, Stack, CardActionArea, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types';

export default function BookCard({ book }: { book: Book }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 6,
        '& .hover-info': {
          opacity: 1
        }
      }
    }}>
      <CardActionArea onClick={() => navigate(`/book/${book._id}`)} sx={{ height: '100%' }}>
        <Box sx={{ position: 'relative', paddingTop: '150%' }}>
          <CardMedia
            component="img"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            image={book.coverUrl || 'https://covers.openlibrary.org/b/id/10958382-L.jpg'}
            alt={book.title}
          />
          <Box
            className="hover-info"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              p: 1,
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            <Typography variant="caption" sx={{ display: 'block' }}>
              {book.pages} pages
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Published: {new Date(book.publishedDate).getFullYear()}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
            by {book.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={book.rating} readOnly precision={0.5} size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {book.rating}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            {book.genre?.map((g) => (
              <Chip 
                key={g} 
                label={g} 
                size="small" 
                sx={{
                  fontSize: '0.7rem',
                  height: '20px'
                }}
                variant="outlined" 
              />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
