import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Avatar, Button, Menu, MenuItem } from "@mui/material";
import { BarChart, Group, FlightTakeoff, Download } from "@mui/icons-material";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import * as XLSX from 'xlsx';

interface VacationStats {
  destination: string;
  followerCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVacations: 0,
    totalUsers: 0,
    totalFollowers: 0,
  });
  const [chartData, setChartData] = useState<VacationStats[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    API.get("/vacations/stats")
      .then((res) => {
        const vacations = res.data;
        const totalVacations = vacations.length;
        const totalFollowers = vacations.reduce((sum: number, row: { followerCount: number }) => sum + row.followerCount, 0);
        setStats({
          totalVacations,
          totalUsers: 42, 
          totalFollowers,
        });

        const sortedData = vacations
          .map((v: any) => ({
            destination: v.destination,
            followerCount: v.followerCount || 0
          }))
          .sort((a: VacationStats, b: VacationStats) => b.followerCount - a.followerCount);

        setChartData(sortedData);
      })
      .catch((err) => {
        console.error("❌ Failed to load dashboard data:", err);
        alert("Failed to load dashboard data.");
      });
  }, []);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const exportToCSV = () => {
    handleExportClose();
    const headers = ["Destination", "Followers Count"];
    const csvContent = [
      headers.join(","),
      ...chartData.map(row => [
        `"${row.destination}"`,
        row.followerCount
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `vacation-followers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    handleExportClose();
    const headers = ["Destination", "Followers Count"];
    const rows = chartData.map(row => [row.destination, row.followerCount]);
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vacation Followers");
    
    XLSX.writeFile(workbook, `vacation-followers-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="primary">
            Dashboard Overview
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={handleExportClick}
              startIcon={<Download />}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Export Data
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
              <MenuItem onClick={exportToExcel}>Export as Excel</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <BarChart fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Total Vacations</Typography>
                <Typography variant="h5" fontWeight={700}>{stats.totalVacations}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                <Group fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                <Typography variant="h5" fontWeight={700}>{stats.totalUsers}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <FlightTakeoff fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Total Followers</Typography>
                <Typography variant="h5" fontWeight={700}>{stats.totalFollowers}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, borderRadius: 2, minHeight: 600 }}>
          <Typography variant="h6" color="primary" fontWeight={600} mb={3}>
            Vacation Followers Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={500}>
            <RechartsBarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 100,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="destination" 
                angle={-45}
                textAnchor="end"
                height={120}
                interval={0}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`${value} followers`, 'Followers']}
              />
              <Legend />
              <Bar 
                dataKey="followerCount" 
                name="Number of Followers"
                fill="#1a237e"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
