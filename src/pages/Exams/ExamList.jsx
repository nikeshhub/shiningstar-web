import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grade as GradeIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from '../../components/common';
import { examAPI } from '../../services/api';

export default function ExamList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getAll();
      if (response.data.success) {
        setExams(response.data.data);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      setSnackbar({ open: true, message: 'Failed to load exams. Please check if the server is running.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/dashboard/exams/add');
  };

  const handleEdit = (examData) => {
    navigate(`/dashboard/exams/edit/${examData._id}`);
  };

  const handleDelete = async () => {
    try {
      await examAPI.delete(examToDelete._id);
      setSnackbar({ open: true, message: 'Exam deleted successfully!', severity: 'success' });
      setDeleteDialog(false);
      setExamToDelete(null);
      loadExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      setSnackbar({ open: true, message: 'Failed to delete exam', severity: 'error' });
    }
  };

  const handleGenerateNotice = async (examId) => {
    try {
      const response = await examAPI.generateNotice(examId);
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Exam notice generated successfully!', severity: 'success' });
        loadExams();
      }
    } catch (error) {
      console.error('Error generating notice:', error);
      setSnackbar({ open: true, message: 'Failed to generate notice', severity: 'error' });
    }
  };

  const handleDownloadNotice = async (examId, examName) => {
    try {
      const response = await examAPI.downloadNotice(examId);

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exam_notice_${examName.replace(/\s/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading notice:', error);
      setSnackbar({ open: true, message: 'Failed to download notice. Please generate it first.', severity: 'error' });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const columns = [
    {
      field: 'examName',
      headerName: 'Exam Name',
      width: 220,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.examName}
          </Typography>
          {row.examType === 'Terminal' && row.terminalNumber && (
            <Chip
              label={`T${row.terminalNumber}`}
              size="small"
              color="warning"
              sx={{ mt: 0.5, height: 18, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'examType',
      headerName: 'Type',
      width: 120,
      renderCell: (row) => (
        <Chip
          label={row.examType}
          size="small"
          color={
            row.examType === 'Final' ? 'error' :
            row.examType === 'Terminal' ? 'warning' :
            'primary'
          }
        />
      ),
    },
    {
      field: 'classes',
      headerName: 'Classes',
      width: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.classes?.slice(0, 2).map((cls, idx) => (
            <Chip
              key={idx}
              label={cls.className}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
          {row.classes?.length > 2 && (
            <Chip
              label={`+${row.classes.length - 2}`}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'dateRange',
      headerName: 'Date Range',
      width: 180,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {formatDate(row.startDate)} - {formatDate(row.endDate)}
        </Typography>
      ),
    },
    {
      field: 'academicYear',
      headerName: 'Year',
      width: 110,
      renderCell: (row) => row.academicYear,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (row) => (
        <Chip
          label={row.status}
          color={
            row.status === 'Completed' ? 'success' :
            row.status === 'Ongoing' ? 'warning' :
            'default'
          }
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            color="success"
            onClick={() => navigate(`/dashboard/exams/${row._id}/marks`)}
            title="Enter Marks"
          >
            <GradeIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleGenerateNotice(row._id)}
            title="Generate Notice PDF"
          >
            <PdfIcon fontSize="small" />
          </IconButton>
          {row.noticeGenerated && (
            <IconButton
              size="small"
              color="info"
              onClick={() => handleDownloadNotice(row._id, row.examName)}
              title="Download Notice"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setExamToDelete(row);
              setDeleteDialog(true);
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const upcomingExams = exams.filter(exam => exam.status === 'Scheduled');
  const completedExams = exams.filter(exam => exam.status === 'Completed');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Exams & Marks (परीक्षा तथा नम्बर)
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd}>
          Add New Exam
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All Exams (${exams.length})`} />
          <Tab label={`Upcoming (${upcomingExams.length})`} />
          <Tab label={`Completed (${completedExams.length})`} />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Table
          columns={columns}
          rows={exams}
          loading={loading}
          emptyMessage="No exams found. Click 'Add New Exam' to create one."
          hover
        />
      )}

      {tabValue === 1 && (
        <Table
          columns={columns}
          rows={upcomingExams}
          loading={loading}
          emptyMessage="No upcoming exams scheduled."
          hover
        />
      )}

      {tabValue === 2 && (
        <Table
          columns={columns}
          rows={completedExams}
          loading={loading}
          emptyMessage="No completed exams."
          hover
        />
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete exam <strong>{examToDelete?.examName}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
