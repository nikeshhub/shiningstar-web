import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { feeAPI, classAPI } from '../../services/api';
import { Table } from '../../components/common';

export default function FeeManagement() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDues: 0,
    totalAdvance: 0,
    todayCollection: 0,
    studentsWithDues: 0,
  });
  const [duesList, setDuesList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({
    classId: '',
    minAmount: '',
    searchQuery: '',
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadClasses();
    loadDuesList();
    loadCollectionSummary();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll();
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadDuesList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.minAmount) params.minAmount = filters.minAmount;

      const response = await feeAPI.getDuesList(params);
      if (response.data.success) {
        const { students, totalDues, count } = response.data.data;
        setDuesList(students);
        setStats((prev) => ({
          ...prev,
          totalDues,
          studentsWithDues: count,
        }));
      }
    } catch (error) {
      console.error('Error loading dues list:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionSummary = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await feeAPI.getCollectionSummary({
        startDate: today.toISOString(),
      });

      if (response.data.success) {
        setStats((prev) => ({
          ...prev,
          todayCollection: response.data.data.totalCollection,
        }));
      }
    } catch (error) {
      console.error('Error loading collection summary:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    loadDuesList();
  };

  const filteredDuesList = duesList.filter((student) => {
    if (!filters.searchQuery) return true;
    const query = filters.searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      field: 'studentId',
      headerName: 'Student ID',
      width: 120,
    },
    {
      field: 'name',
      headerName: 'Student Name',
      flex: 1,
    },
    {
      field: 'currentClass',
      headerName: 'Class',
      width: 150,
      renderCell: (row) => row.currentClass?.className || '-',
    },
    {
      field: 'parentContact',
      headerName: 'Contact',
      width: 130,
      renderCell: (row) => row.parentContact?.mobile || '-',
    },
    {
      field: 'totalDue',
      headerName: 'Amount Due',
      width: 130,
      renderCell: (row) => (
        <Typography color="error" fontWeight="bold">
          Rs. {row.feeBalance?.totalDue || 0}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (row) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={() => navigate(`/dashboard/fee/ledger/${row._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Fee Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Track fee collections, dues, and payments. Monthly fees are managed in Classes, exam fees in Exams.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', border: '2px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Dues
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                    Rs. {stats.totalDues}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.studentsWithDues} students
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 50, color: '#ff9800', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', border: '2px solid #4caf50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Advance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    Rs. {stats.totalAdvance}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prepaid balance
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 50, color: '#4caf50', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', border: '2px solid #2196f3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Today's Collection
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                    Rs. {stats.todayCollection}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Collected today
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 50, color: '#2196f3', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5', border: '2px solid #9c27b0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Net Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Rs. {stats.totalDues - stats.totalAdvance}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Outstanding
                  </Typography>
                </Box>
                <BalanceIcon sx={{ fontSize: 50, color: '#9c27b0', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Class"
                value={filters.classId}
                onChange={(e) => handleFilterChange('classId', e.target.value)}
              >
                <MenuItem value="">All Classes</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.className}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minimum Due Amount"
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="e.g., 1000"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search Student"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                placeholder="Name or ID"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dues List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Students with Dues (बक्यौता सूची)
            </Typography>
            <Chip
              label={`${filteredDuesList.length} Students`}
              color="error"
              variant="outlined"
            />
          </Box>

          {filteredDuesList.length === 0 && !loading ? (
            <Alert severity="success">
              No students with pending dues! All clear.
            </Alert>
          ) : (
            <Table
              columns={columns}
              rows={filteredDuesList}
              loading={loading}
              pagination={true}
              rowsPerPage={10}
            />
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
