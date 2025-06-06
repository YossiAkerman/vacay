import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Vacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image: string;
}

interface VacationStats {
  followerCount: number;
  totalBookings: number;
  averageRating: number;
  monthlyFollowers: { month: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function VacationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vacation, setVacation] = useState<Vacation | null>(null);
  const [stats, setStats] = useState<VacationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacationRes, statsRes] = await Promise.all([
          API.get(`/vacations/${id}`),
          API.get(`/vacations/${id}/stats`)
        ]);
        setVacation(vacationRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load vacation details");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !vacation || !stats) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 4 }}>
          <Typography color="error">{error || "Vacation not found"}</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  const pieData = [
    { name: 'Followers', value: stats.followerCount },
    { name: 'Bookings', value: stats.totalBookings },
    { name: 'Rating', value: stats.averageRating * 20 }, 
  ];

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin")}
          sx={{ mb: 4 }}
        >
          Back to Admin Panel
        </Button>

        <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <img
                src={`http://localhost:3006/images/${vacation.image}`}
                alt={vacation.destination}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom fontWeight={700}>
                {vacation.destination}
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Chip
                  icon={<CalendarIcon />}
                  label={`${new Date(vacation.start_date).toLocaleDateString()} - ${new Date(
                    vacation.end_date
                  ).toLocaleDateString()}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<MoneyIcon />}
                  label={`$${vacation.price}`}
                  color="success"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {vacation.description}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/admin/vacations/${id}/edit`)}
                  sx={{ mr: 2 }}
                >
                  Edit Vacation
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this vacation?")) {
                      API.delete(`/vacations/${id}`)
                        .then(() => navigate("/admin"))
                        .catch((err) => alert("Failed to delete vacation"));
                    }
                  }}
                >
                  Delete Vacation
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Section */}
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
            Vacation Statistics
          </Typography>
          
          <Grid container spacing={4}>
            {/* Monthly Followers Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Followers Trend
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlyFollowers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DashboardLayout>
  );
} 