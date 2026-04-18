import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon, MenuBook as BookIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DetailPage, DetailSection, DetailRow, StatusChip, Table, Toast } from '../../components/common';
import { classAPI, timetableAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookDialog, setBookDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [bookData, setBookData] = useState({
    bookName: '',
    publication: '',
    cost: '',
    coverPhoto: '',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const canManageClass = user?.role === 'Admin';

  useEffect(() => {
    loadClass();
    loadTimetable();
  }, [id]);

  const loadClass = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getById(id);
      if (response.data.success) {
        setClassData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading class:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimetable = async () => {
    try {
      const response = await timetableAPI.getAll({ classId: id });
      if (response.data.success) {
        setTimetableSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const handleEditBook = (subject) => {
    setSelectedSubject(subject);
    setBookData({
      bookName: subject.book?.bookName || '',
      publication: subject.book?.publication || '',
      cost: subject.book?.cost || '',
      coverPhoto: subject.book?.coverPhoto || '',
    });
    setBookDialog(true);
  };

  const handleSaveBook = async () => {
    if (!canManageClass) {
      return;
    }

    try {
      const response = await classAPI.updateSubjectBook(id, selectedSubject.subject._id || selectedSubject.subject, bookData);
      if (response.data.success) {
        setToast({ open: true, message: 'Book information saved successfully!', severity: 'success' });
        setBookDialog(false);
        loadClass(); // Reload to get updated data
      }
    } catch (error) {
      console.error('Error saving book:', error);
      setToast({ open: true, message: 'Failed to save book information', severity: 'error' });
    }
  };

  if (loading) {
    return <DetailPage loading={true} />;
  }

  if (!classData) {
    return (
      <Box sx={{ textAlign: 'center', pt: 10 }}>
        <Typography variant="h6" color="text.secondary">Class not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/dashboard/classes')}>
          Back to Classes
        </Button>
      </Box>
    );
  }

  const studentColumns = [
    {
      field: 'studentId',
      headerName: 'Student ID',
      width: 130,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {row.studentId}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
    },
    {
      field: 'rollNumber',
      headerName: 'Roll No',
      width: 100,
    },
    {
      field: 'parentContact',
      headerName: 'Parent Contact',
      width: 160,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (row) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => navigate(`/dashboard/students/${row._id}`)}
          title="View Student"
        >
          <PersonIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const periods = [1, 2, 3, 4, 5, 6, 7];
  const grid = {};
  timetableSlots.forEach((slot) => {
    grid[slot.period] = slot;
  });

  return (
    <DetailPage
      title={classData.className}
      backTo="/dashboard/classes"
      loading={false}
      actions={canManageClass ? (
        <Button startIcon={<EditIcon />} onClick={() => navigate(`/dashboard/classes/edit/${id}`)}>
          Edit Class
        </Button>
      ) : null}
    >
      {/* Class Info */}
      <DetailSection title="Class Information">
        <DetailRow label="Class Name" value={classData.className} />
        <DetailRow label="Status" value={<StatusChip status={classData.status} />} />
        <DetailRow label="Class Teacher" value={classData.classTeacher?.name || 'Not Assigned'} />
        <DetailRow label="Capacity" value={classData.capacity} />
        <DetailRow
          label="Monthly Fee"
          value={
            <Typography sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Rs. {classData.monthlyFee || 0}
            </Typography>
          }
        />
      </DetailSection>

      {/* Revenue Summary */}
      <DetailSection title="Revenue Summary">
        <DetailRow label="Enrolled Students" value={classData.studentCount || 0} />
        <DetailRow
          label="Total Monthly Revenue"
          value={
            <Typography sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Rs. {classData.totalMonthlyRevenue || 0}
            </Typography>
          }
        />
      </DetailSection>

      {/* Timetable */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
          Weekly Timetable
        </Typography>
        {timetableSlots.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <MuiTable size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', width: 90 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', textAlign: 'center' }}>
                    Subjects & Teacher
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {periods.map(period => {
                  const slot = grid[period];
                  return (
                    <TableRow key={period}>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>P{period}</TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        {slot?.subjects?.length ? slot.subjects.map((subject) => (
                          <Typography key={subject._id || subject} variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                            {subject.subjectName || subject}
                          </Typography>
                        )) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                        )}
                        {slot?.teacher && (
                          <Typography variant="caption" color="text.secondary">
                            Teacher: {slot.teacher.name || slot.teacher}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </MuiTable>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No timetable configured for this class.
          </Typography>
        )}
      </Box>

      {/* Subject Books */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
          Subject Books
        </Typography>
        {classData.subjects && classData.subjects.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Publication</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Cost</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', textAlign: 'center' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classData.subjects.map((subject, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {subject.subject?.subjectName || subject.subjectName || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {subject.book?.bookName || (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Not set
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {subject.book?.publication || (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Not set
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {subject.book?.cost ? (
                        <Typography sx={{ fontWeight: 500, color: '#2e7d32' }}>
                          Rs. {subject.book.cost}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Not set
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {canManageClass ? (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditBook(subject)}
                          title="Edit Book Info"
                        >
                          <BookIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Typography variant="body2" color="text.disabled">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No subjects configured for this class.
          </Typography>
        )}
      </Box>

      {/* Enrolled Students Table */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
          Enrolled Students
        </Typography>
        <Table
          columns={studentColumns}
          rows={classData.enrolledStudents || []}
          emptyMessage="No students enrolled in this class."
          hover
        />
      </Box>

      {/* Book Edit Dialog */}
      <Dialog open={bookDialog} onClose={() => setBookDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Book Information - {selectedSubject?.subject?.subjectName || selectedSubject?.subjectName}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Book Name"
                value={bookData.bookName}
                onChange={(e) => setBookData({ ...bookData, bookName: e.target.value })}
                placeholder="e.g., My English Book"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Publication"
                value={bookData.publication}
                onChange={(e) => setBookData({ ...bookData, publication: e.target.value })}
                placeholder="e.g., Ekta Books"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Cost (Rs.)"
                type="number"
                value={bookData.cost}
                onChange={(e) => setBookData({ ...bookData, cost: e.target.value })}
                placeholder="e.g., 250"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Cover Photo URL (optional)"
                value={bookData.coverPhoto}
                onChange={(e) => setBookData({ ...bookData, coverPhoto: e.target.value })}
                placeholder="https://example.com/book-cover.jpg"
                helperText="Enter a URL to the book cover image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setBookDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveBook}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </DetailPage>
  );
}
