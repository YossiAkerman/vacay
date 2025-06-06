import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface PriceSortProps {
  onSortChange: (sortType: string) => void;
}

export default function PriceSort({ onSortChange }: PriceSortProps) {
  const [sortType, setSortType] = React.useState('price_asc');

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    setSortType(value);
    onSortChange(value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel sx={{ fontSize: '1.1rem' }}>Sort by Price</InputLabel>
      <Select
        value={sortType}
        label="Sort by Price"
        onChange={handleSortChange}
        sx={{ 
          fontSize: '1.1rem',
          '& .MuiSelect-select': {
            fontSize: '1.1rem'
          }
        }}
      >
        <MenuItem value="price_asc" sx={{ fontSize: '1.1rem' }}>Price: Low to High</MenuItem>
        <MenuItem value="price_desc" sx={{ fontSize: '1.1rem' }}>Price: High to Low</MenuItem>
      </Select>
    </FormControl>
  );
} 