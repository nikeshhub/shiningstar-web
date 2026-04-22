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
import { feeAPI } from '../../hooks/reactQueryApi';
import { Table } from '../../components/common';
import { todayBSDate } from '../../utils/nepaliDate';

export default function FeeManagement() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDues: 0,
    totalAdvance: 0,
    todayCollection: 0,
    familiesWithDues: 0,
  });
  const [duesList, setDuesList] = useState([]);
  const [filters, setFilters] = useState({
    minAmount: '',
    searchQuery: '',
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadDuesList();
    loadCollectionSummary();
  }, []);

  const loadDuesList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.minAmount) params.minAmount = filters.minAmount;

      const response = await feeAPI.getDuesList(params);
      if (response.data.success) {
        const { families, totalDues, count } = response.data.data;
        setDuesList(families || []);
        setStats((prev) => ({
          ...prev,
          totalDues,
          familiesWithDues: count,
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
      const response = await feeAPI.getCollectionSummary({
        startDate: todayBSDate(),
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

  const filteredDuesList = duesList.filter((family) => {
    if (!filters.searchQuery) return true;
    const query = filters.searchQuery.toLowerCase();
    return (
      family.familyId?.toLowerCase().includes(query) ||
      family.primaryContact?.name?.toLowerCase().includes(query) ||
      family.primaryContact?.mobile?.includes(query)
    );
  });

  const columns = [
    {
      field: 'familyId',
      headerName: 'Family ID',
      width: 120,
    },
    {
      field: 'primaryContact',
      headerName: 'Primary Contact',
      flex: 1,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.primaryContact?.name || '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.primaryContact?.mobile || '-'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'studentCount',
      headerName: 'Students',
      width: 100,
      renderCell: (row) => row.studentCount ?? (row.students?.length ?? 0),
    },
    {
      field: 'totalDue',
      headerName: 'Amount Due',
      width: 140,
      renderCell: (row) => (
        <Typography color="error" fontWeight="bold">
          Rs. {row.familyFeeBalance?.totalDue || 0}
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
          onClick={() => navigate(`/dashboard/families/${row._id}`)}
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
          Family-level fee collections, dues, and payments. All fees are billed and tracked per family.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    {stats.familiesWithDues} families
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 50, color: '#ff9800', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Minimum Due Amount"
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="e.g., 1000"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Search Family"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                placeholder="Family ID, contact name, or mobile"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
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
              Families with Dues (बक्यौता सूची)
            </Typography>
            <Chip
              label={`${filteredDuesList.length} Families`}
              color="error"
              variant="outlined"
            />
          </Box>

          {filteredDuesList.length === 0 && !loading ? (
            <Alert severity="success">
              No families with pending dues! All clear.
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
