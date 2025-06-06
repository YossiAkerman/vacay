import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { Grid, Box } from "@mui/material";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Image as ImageIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';

interface Vacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: any;
  image: string;
}

export default function AdminPanel() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [form, setForm] = useState<Omit<Vacation, "vacation_id">>({
    destination: "",
    description: "",
    start_date: "",
    end_date: "",
    price: 0,
    image: ""
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      // Update form with the file name
      setForm(prev => ({
        ...prev,
        image: file.name
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const fetchVacations = async () => {
    try {
      const res = await API.get("/vacations");
      setVacations(res.data);
    } catch (err) {
      console.error("Failed to fetch vacations", err);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await API.post("/vacations/add", form);
      await fetchVacations();
      setOpenDialog(false);
      setForm({
        destination: "",
        description: "",
        start_date: "",
        end_date: "",
        price: 0,
        image: ""
      });
      setPreviewUrl(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add vacation.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this vacation?");
    if (!confirmed) return;

    try {
      await API.delete(`/vacations/${id}`);
      await fetchVacations();
    } catch (err) {
      alert("Failed to delete vacation.");
      console.error(err);
    }
  };

  const handleEdit = (v: Vacation) => {
    setEditId(v.vacation_id);
    setForm({
      destination: v.destination,
      description: v.description,
      start_date: v.start_date,
      end_date: v.end_date,
      price: v.price,
      image: v.image,
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({
      destination: "",
      description: "",
      start_date: "",
      end_date: "",
      price: 0,
      image: ""
    });
    setPreviewUrl(null);
  };

  const handleUpdate = async (id: number) => {
    try {
      await API.put(`/vacations/${id}`, form);
      setEditId(null);
      await fetchVacations();
    } catch (err) {
      alert("Failed to update vacation.");
      console.error(err);
    }
  };

  const handleViewDetails = (vacationId: number) => {
    navigate(`/admin/vacations/${vacationId}`);
  };

  const getImageUrl = (imageName: string) => {
    if (!imageName) return '';
    if (imageName.startsWith('http')) return imageName;
    return `http://localhost:3006/images/${imageName}`;
  };

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n - 1) + '…' : str;

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1, maxWidth: '1400px', mx: 'auto', width: '100%' }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3} component="div">
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                bgcolor: 'primary.main', 
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Avatar sx={{ bgcolor: 'white', width: 48, height: 48 }}>
                <BarChartIcon fontSize="large" color="primary" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Vacations</Typography>
                <Typography variant="h4" fontWeight={700}>{vacations.length}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={9} component="div">
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
              <Typography variant="h6" color="primary">Manage Vacations</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Add Vacation
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Add New Vacation</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  name="destination"
                  label="Destination"
                  value={form.destination}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Description"
                  value={form.description}
                  onChange={handleChange}
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="date"
                    name="start_date"
                    label="Start Date"
                    value={form.start_date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    type="date"
                    name="end_date"
                    label="End Date"
                    value={form.end_date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="price"
                    label="Price"
                    value={form.price}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>

                {/* Image Upload Section */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  {previewUrl ? (
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '8px'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {form.image}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to select a file
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => {
              setOpenDialog(false);
              setPreviewUrl(null);
            }} variant="outlined">Cancel</Button>
            <Button onClick={handleAdd} variant="contained">Add Vacation</Button>
          </DialogActions>
        </Dialog>

        <Typography variant="h5" fontWeight={600} mb={3} color="primary">
          Vacation List
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacations.map((v) => (
                <TableRow key={v.vacation_id}>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={getImageUrl(v.image)}
                      alt={v.destination}
                      sx={{ width: 64, height: 48, bgcolor: 'grey.100' }}
                    >
                      <ImageIcon color="disabled" />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    {editId === v.vacation_id ? (
                      <TextField
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      <Typography fontWeight={600} color="primary">{v.destination}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    {editId === v.vacation_id ? (
                      <TextField
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        size="small"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {truncate(v.description, 80)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === v.vacation_id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          type="date"
                          name="start_date"
                          value={form.start_date}
                          onChange={handleChange}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          type="date"
                          name="end_date"
                          value={form.end_date}
                          onChange={handleChange}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
                    ) : (
                      <Chip
                        icon={<CalendarIcon />}
                        label={`${new Date(v.start_date).toLocaleDateString("en-GB")} - ${new Date(v.end_date).toLocaleDateString("en-GB")}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === v.vacation_id ? (
                      <TextField
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      <Typography fontWeight={700} color="primary">
                        ${Number(v.price || 0).toFixed(2)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editId === v.vacation_id ? (
                      <>
                        <IconButton color="primary" onClick={() => handleUpdate(v.vacation_id)}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton color="error" onClick={handleCancel}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          color="info" 
                          onClick={() => handleViewDetails(v.vacation_id)}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleEdit(v)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(v.vacation_id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardLayout>
  );
}
