import { Box, Pagination as MuiPagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  pageSize, 
  totalItems,
  onPageChange, 
  onPageSizeChange 
}: PaginationProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mt: 3,
      px: 2
    }}>
      <FormControl size="small">
        <InputLabel>Items per page</InputLabel>
        <Select
          value={pageSize}
          label="Items per page"
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={24}>24</MenuItem>
          <MenuItem value={48}>48</MenuItem>
        </Select>
      </FormControl>

      <MuiPagination 
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        size="large"
      />

      <Box sx={{ minWidth: 120, textAlign: 'right' }}>
        {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`}
      </Box>
    </Box>
  );
}