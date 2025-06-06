import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, IconButton, Avatar, Divider, ListItemButton } from "@mui/material";
import { Home, FlightTakeoff, Person } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { label: "Home", icon: <Home />, path: "/" },
  { label: "Vacations", icon: <FlightTakeoff />, path: "/vacations" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const name = localStorage.getItem("name") || "User";

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f6f8fb' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#fff', borderRight: '1px solid #e0e0e0' },
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography variant="h6" color="primary" fontWeight={700}>
            Vacation App
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5, borderRadius: 2 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': { bgcolor: '#f0f4ff', color: 'primary.main', fontWeight: 600 },
                  borderRadius: 2,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box flexGrow={1} />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <div className="flex items-center gap-2">
            <Avatar sx={{ bgcolor: "#3973c6", width: 32, height: 32, fontSize: 18 }}>
              {name ? name[0].toUpperCase() : "?"}
            </Avatar>
            <span className="text-gray-700 text-base">Welcome, {name}</span>
          </div>
          <Typography variant="caption" color="text.secondary">2025 All Rights Reserved YA</Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: `${drawerWidth}px`, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={0} color="inherit" sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          <Toolbar sx={{ minHeight: 64, justifyContent: 'space-between' }}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              Vacation Management
            </Typography>
            <Avatar sx={{ bgcolor: 'primary.main' }}>{name[0]}</Avatar>
          </Toolbar>
        </AppBar>
        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
} 