import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PriceSort from './PriceSort';

interface VacationNavbarProps {
  onFilterChange: (filter: string) => void;
  onSortChange: (sortType: string) => void;
}

export default function VacationNavbar({ onFilterChange, onSortChange }: VacationNavbarProps) {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
          <Button 
            color="primary" 
            onClick={() => {
              onFilterChange('all');
              navigate('/vacations');
            }}
            sx={{ fontSize: '1.1rem' }}
          >
            All Vacations
          </Button>
          
          <Button 
            color="primary" 
            onClick={() => {
              onFilterChange('followed');
              navigate('/vacations');
            }}
            sx={{ fontSize: '1.1rem' }}
          >
            Followed
          </Button>
          
          <Button 
            color="primary" 
            onClick={() => {
              onFilterChange('upcoming');
              navigate('/vacations');
            }}
            sx={{ fontSize: '1.1rem' }}
          >
            Upcoming
          </Button>

          <Box sx={{ display: 'flex', gap: 1, ml: 'auto', alignItems: 'center' }}>
            <PriceSort onSortChange={onSortChange} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 