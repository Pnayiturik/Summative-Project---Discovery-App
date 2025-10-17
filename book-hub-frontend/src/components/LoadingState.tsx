import { Skeleton, Box, Paper } from '@mui/material';

/**
 * LoadingState Component
 * 
 * A reusable loading state component that shows appropriate skeleton UI
 * based on the content type being loaded.
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of content being loaded ('book' | 'list' | 'filter')
 * @param {number} props.count - Number of skeleton items to show
 * @returns {JSX.Element} Appropriate skeleton UI
 */
export default function LoadingState({ 
  type = 'book', 
  count = 1 
}: { 
  type?: 'book' | 'list' | 'filter';
  count?: number;
}) {
  const renderBookSkeleton = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" />
    </Paper>
  );

  const renderListSkeleton = () => (
    <Box sx={{ py: 1 }}>
      <Skeleton variant="text" width="100%" height={40} />
      <Skeleton variant="text" width="90%" height={40} />
      <Skeleton variant="text" width="95%" height={40} />
    </Box>
  );

  const renderFilterSkeleton = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" height={35} sx={{ mb: 1 }} />
      ))}
    </Paper>
  );

  const skeletons = {
    book: renderBookSkeleton,
    list: renderListSkeleton,
    filter: renderFilterSkeleton
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i}>{skeletons[type]()}</Box>
      ))}
    </>
  );
}