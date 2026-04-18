import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Button, Toast } from '../../components/common';
import { progressReportAPI, classAPI, studentAPI } from '../../services/api';

const ACADEMIC_YEARS = ['2080-2081', '2081-2082', '2082-2083'];

export default function ProgressReportList() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('2081-2082');
  const [students, setStudents] = useState([]);
  const [progressReports, setProgressReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadProgressReports();
    }
  }, [selectedClass, selectedYear]);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll({ status: 'Active' });
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await classAPI.getStudents(selectedClass);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadProgressReports = async () => {
    if (!selectedClass || !selectedYear) return;

    try {
      setLoading(true);
      const response = await progressReportAPI.getByClass({
        classId: selectedClass,
        academicYear: selectedYear,
      });
      if (response.data.success) {
        setProgressReports(response.data.data);
      }
    } catch (error) {
      console.error('Error loading progress reports:', error);
      setProgressReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!selectedClass || !selectedYear) {
      setToast({ open: true, message: 'Please select class and academic year', severity: 'warning' });
      return;
    }

    try {
      setGenerating(true);
      const response = await progressReportAPI.bulkGenerate({
        classId: selectedClass,
        academicYear: selectedYear,
      });

      if (response.data.success) {
        const { successful, failed } = response.data.data;
        setToast({
          open: true,
          message: `Generated ${successful.length} reports successfully. ${failed.length} failed.`,
          severity: successful.length > 0 ? 'success' : 'error',
        });
        loadProgressReports();
      }
    } catch (error) {
      console.error('Error generating reports:', error);
      setToast({ open: true, message: 'Failed to generate progress reports', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePDF = async (studentId) => {
    try {
      const response = await progressReportAPI.generatePDF({
        studentId,
        academicYear: selectedYear,
      });

      if (response.data.success) {
        setToast({ open: true, message: 'PDF generated successfully!', severity: 'success' });
        // Auto-download
        handleDownloadPDF(studentId);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToast({ open: true, message: 'Failed to generate PDF', severity: 'error' });
    }
  };

  const handleDownloadPDF = async (studentId) => {
    try {
      const response = await progressReportAPI.downloadPDF({
        studentId,
        academicYear: selectedYear,
      });

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `progress_report_${studentId}_${selectedYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setToast({ open: true, message: 'Failed to download PDF', severity: 'error' });
    }
  };

  const getReportStatus = (studentId) => {
    return progressReports.find(r => r.student._id === studentId);
  };

  const calculateOverallGPA = (report) => {
    if (!report || !report.terminals) return 0;
    const completedTerminals = report.terminals.filter(t => t.marks !== null);
    if (completedTerminals.length === 0) return 0;
    const totalGPA = completedTerminals.reduce((sum, t) => sum + t.gpa, 0);
    return (totalGPA / completedTerminals.length).toFixed(2);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Progress Reports (प्रगति रिपोर्ट)
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
              >
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label="Academic Year"
              >
                {ACADEMIC_YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                onClick={handleBulkGenerate}
                loading={generating}
                disabled={!selectedClass}
                fullWidth
              >
                Generate All Reports
              </Button>
              <IconButton
                color="primary"
                onClick={loadProgressReports}
                disabled={!selectedClass}
                title="Refresh"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Student Progress Reports */}
      {selectedClass && (
        <Grid container spacing={2}>
          {students.length === 0 && !loading && (
            <Grid size={12}>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No students found in this class.
              </Typography>
            </Grid>
          )}

          {students.map((student) => {
            const report = getReportStatus(student._id);
            const hasReport = Boolean(report);
            const gpa = hasReport ? report.yearlyTotal?.gradePoint : 0;
            const grade = hasReport ? report.yearlyTotal?.grade : 'N/A';

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={student._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: hasReport ? '2px solid #4caf50' : '1px solid #e0e0e0',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {student.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Roll: {student.rollNumber} | ID: {student.studentId}
                    </Typography>

                    {hasReport ? (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">GPA:</Typography>
                          <Chip
                            label={`${gpa} (${grade})`}
                            size="small"
                            color="success"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Terminals:</Typography>
                          <Typography variant="body2">
                            {report.terminals?.filter(t => t.marks !== null).length || 0} / {report.terminals?.length || 0}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                        Report not generated
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    {hasReport ? (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PdfIcon />}
                          onClick={() => handleGeneratePDF(student._id)}
                        >
                          PDF
                        </Button>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownloadPDF(student._id)}
                          title="Download"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Generate reports to view
                      </Typography>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
