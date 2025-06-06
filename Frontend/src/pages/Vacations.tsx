import React, { useState, useEffect } from "react";
import API from "../services/api";
import UserLayout from "../components/UserLayout";
import VacationNavbar from "../components/VacationNavbar";
import { Grid, Box } from "@mui/material";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Stack,
  Paper,
  Avatar,
  Chip,
  Pagination
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";


interface Vacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image: string;
  isFollowed: boolean;
}

export default function Vacations() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [filteredVacations, setFilteredVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [sortType, setSortType] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    API.get("/vacations")
      .then((res) => {
        setVacations(res.data);
        setFilteredVacations(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch vacations", err);
      });
  }, []);

  useEffect(() => {
    let filtered = [...vacations];

    switch (currentFilter) {
      case 'followed':
        filtered = filtered.filter(v => v.isFollowed);
        break;
      case 'upcoming':
        const today = new Date();
        filtered = filtered.filter(v => new Date(v.start_date) > today);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortType) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredVacations(filtered);
    setPage(1); 
  }, [currentFilter, vacations, sortType]);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleSortChange = (sortType: string) => {
    setSortType(sortType);
  };

  const handleFollow = async (id: number) => {
    try {
      const vacation = vacations.find(v => v.vacation_id === id);
      if (!vacation) return;

      if (vacation.isFollowed) {
        await API.delete(`/vacations/${id}/follow`);
      } else {
        await API.post(`/vacations/${id}/follow`);
      }
      
      setVacations(vacations.map(v => 
        v.vacation_id === id ? { ...v, isFollowed: !v.isFollowed } : v
      ));
    } catch (err) {
      console.error("Failed to follow/unfollow vacation", err);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getImageUrl = (imageName: string) => {
    if (!imageName) return '';
    if (imageName.startsWith('http')) return imageName;
    return `http://localhost:3006/images/${imageName}`;
  };

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n - 1) + '…' : str;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVacations = filteredVacations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredVacations.length / itemsPerPage);

  return (
    <UserLayout>
      <Box sx={{ flexGrow: 1, maxWidth: '1400px', mx: 'auto', width: '100%' }}>
        <VacationNavbar 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        
        <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                justifyContent: 'space-between', 
                bgcolor: 'white', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" color="primary">
                {currentFilter === 'all' ? 'Available Vacations' :
                 currentFilter === 'followed' ? 'Followed Vacations' :
                 'Upcoming Vacations'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredVacations.length} vacations
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {currentVacations.map((v) => (
            <Grid item xs={12} sm={6} key={v.vacation_id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="280"
                  image={getImageUrl(v.image)}
                  alt={v.destination}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" component="div" gutterBottom fontWeight={600} color="primary">
                    {v.destination}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {truncate(v.description, 150)}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<CalendarIcon />}
                      label={`${new Date(v.start_date).toLocaleDateString()} - ${new Date(v.end_date).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<MoneyIcon />}
                      label={`$${v.price}`}
                      size="small"
                      variant="outlined"
                      color="success"
                    />
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <IconButton 
                    color={v.isFollowed ? "error" : "default"}
                    onClick={() => handleFollow(v.vacation_id)}
                    sx={{ 
                      ml: 'auto',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                      }
                    }}
                  >
                    {v.isFollowed ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </UserLayout>
  );
}
