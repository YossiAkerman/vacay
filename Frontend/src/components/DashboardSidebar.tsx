import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@mui/material';
import { Dashboard as DashboardIcon, BarChart as BarChartIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 180,
        height: '100vh',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: 'white',
        zIndex: 1200,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, p: 2, pb: 1 }}>
          Admin Panel
        </Typography>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/admin/dashboard')}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: 15 }} />
          </ListItem>
          <ListItem button onClick={() => navigate('/admin')}>
            <ListItemIcon>
              <BarChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Vacations" primaryTypographyProps={{ fontSize: 15 }} />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ pb: 2, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', mb: 0.5, bgcolor: 'grey.400', width: 36, height: 36 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="caption" color="text.secondary" display="block">
          Admin Dashboard
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: 10 }}>
          2025 All Rights Reserved YA
        </Typography>
      </Box>
    </Box>
  );
} 