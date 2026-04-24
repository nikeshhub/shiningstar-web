import React, { useMemo, useState } from 'react';
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  TextField,
  IconButton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  QrCode as QrCodeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Dialog, RoleBasedAccess } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, DashboardCard, StatusBadge } from '../../components/dashboard';
import { useClasses, useDeleteStudent, useQueryStatus, useStudents } from '../../hooks';

export default function StudentList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, studentId: null, studentName: '' });
  const canManageStudents = user?.role === 'Admin';
  const showFeeBalance = user?.role === 'Admin';
  const isTeacher = user?.role === 'Teacher';
  const queryParams = useMemo(() => {
    const params = {};
    if (appliedSearch) params.search = appliedSearch;
    if (filterClass && !isTeacher) params.class = filterClass;
    if (filterStatus) params.status = filterStatus;
    return params;
  }, [appliedSearch, filterClass, filterStatus, isTeacher]);
  const studentsQuery = useStudents(queryParams);
  const classesQuery = useClasses();
  const { data: students = [], isInitialLoading, isRefreshing } = useQueryStatus(studentsQuery, {
    hasData: (data) => Array.isArray(data),
  });
  const { data: classes = [] } = useQueryStatus(classesQuery, {
    hasData: (data) => Array.isArray(data),
  });
  const deleteStudentMutation = useDeleteStudent();

  const handleSearch = () => {
    setAppliedSearch(search.trim());
  };

  const handleDelete = (student) => {
    setDeleteDialog({ open: true, studentId: student._id, studentName: student.name });
  };

  const confirmDelete = async () => {
    try {
      await deleteStudentMutation.mutateAsync(deleteDialog.studentId);
      setDeleteDialog({ open: false, studentId: null, studentName: '' });
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, studentId: null, studentName: '' });
  };

  const getStatusType = (status) => {
    const types = {
      Active: 'success',
      Inactive: 'secondary',
      Transferred: 'warning',
      Graduated: 'info',
    };
    return types[status] || 'secondary';
  };

  return (
    <Box>
      <PageHeader
        title="<em>Students</em> Directory"
        action={
          <RoleBasedAccess allowedRoles="Admin">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/students/add')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
              }}
            >
              Add Student
            </Button>
          </RoleBasedAccess>
        }
      />

      <DashboardCard hover={false} sx={{ mb: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder={isTeacher ? "Search students in my class..." : "Search by name, ID, or contact..."}
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                fontSize: '13px',
              },
            }}
          />
          {!isTeacher && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ fontSize: '13px' }}>Class</InputLabel>
              <Select
                value={filterClass}
                label="Class"
                onChange={(e) => setFilterClass(e.target.value)}
                sx={{ fontSize: '13px' }}
              >
                <MenuItem value="" sx={{ fontSize: '13px' }}>All Classes</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id} sx={{ fontSize: '13px' }}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ fontSize: '13px' }}>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ fontSize: '13px' }}
            >
              <MenuItem value="" sx={{ fontSize: '13px' }}>All</MenuItem>
              <MenuItem value="Active" sx={{ fontSize: '13px' }}>Active</MenuItem>
              <MenuItem value="Inactive" sx={{ fontSize: '13px' }}>Inactive</MenuItem>
              <MenuItem value="Transferred" sx={{ fontSize: '13px' }}>Transferred</MenuItem>
              <MenuItem value="Graduated" sx={{ fontSize: '13px' }}>Graduated</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Search
          </Button>
        </Stack>
      </DashboardCard>

      <DashboardCard noPadding>
        {isRefreshing && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Student ID
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Class
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Roll No
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Parent Contact
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Status
                </TableCell>
                {showFeeBalance && (
                  <TableCell
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                    }}
                  >
                    Fee Balance
                  </TableCell>
                )}
                <TableCell
                  align="right"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student._id}
                hover
                sx={{
                  '&:hover': {
                    bgcolor: 'background.default',
                  },
                }}
              >
                <TableCell sx={{ fontSize: '13px', fontWeight: 500, color: 'text.secondary' }}>
                  {student.studentId}
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
                    {student.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  {student.currentClass?.className || '-'}
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  {student.rollNumber || '-'}
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  {student.parentContact}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={student.status}
                    status={getStatusType(student.status)}
                  />
                </TableCell>
                {showFeeBalance && (
                  <TableCell>
                    {student.family?.familyFeeBalance?.totalDue > 0 ? (
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'error.main' }}>
                        Due: Rs. {student.family.familyFeeBalance.totalDue}
                      </Typography>
                    ) : student.family?.familyFeeBalance?.totalAdvance > 0 ? (
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'success.main' }}>
                        Adv: Rs. {student.family.familyFeeBalance.totalAdvance}
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                        Clear
                      </Typography>
                    )}
                  </TableCell>
                )}
                <TableCell align="right">
                  {/* View Details - All roles can view */}
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/dashboard/students/${student._id}`)}
                    title="View Details"
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>

                  {/* Edit - Only Admin */}
                  {canManageStudents && (
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => navigate(`/dashboard/students/edit/${student._id}`)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}

                  {/* Family Ledger - Only Admin */}
                  <RoleBasedAccess allowedRoles="Admin">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/families/${student.family?._id || student.family}`)}
                      title="Family Ledger"
                      disabled={!student.family}
                    >
                      <QrCodeIcon fontSize="small" />
                    </IconButton>
                  </RoleBasedAccess>

                  {/* Delete - Only Admin */}
                  <RoleBasedAccess allowedRoles="Admin">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(student)}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </RoleBasedAccess>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && !isInitialLoading && (
              <TableRow>
                <TableCell colSpan={showFeeBalance ? 8 : 7} align="center" sx={{ py: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: 'text.secondary',
                    }}
                  >
                    No students found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>
        {isInitialLoading && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">Loading students...</Typography>
          </Box>
        )}
      </DashboardCard>

      <Dialog
        variant="confirm"
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteDialog.studentName}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
