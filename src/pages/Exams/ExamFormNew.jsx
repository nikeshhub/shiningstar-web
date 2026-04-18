import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  alpha,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Toast, Select } from "../../components/common";
import { examAPI, classAPI, subjectAPI } from "../../services/api";

const EXAM_TYPES = ["Terminal", "Final", "Unit Test", "Other"];
const EXAM_STATUS = ["Scheduled", "Ongoing", "Completed", "Cancelled"];
const ACADEMIC_YEARS = ["2080-2081", "2081-2082", "2082-2083"];

export default function ExamFormNew() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    examName: "",
    examType: "Terminal",
    terminalNumber: 1,
    academicYear: "2081-2082",
    classes: [],
    startDate: "",
    endDate: "",
    status: "Scheduled",
    routine: [],
    remarks: "",
  });

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [routineEntry, setRoutineEntry] = useState({
    class: "",
    subjects: [], // Changed to array for multi-select
    examDate: "",
    startTime: "09:00",
    endTime: "11:00",
    duration: 120,
  });

  useEffect(() => {
    loadClasses();
    loadSubjects();
    if (isEdit) {
      loadExam();
    }
  }, [id]);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll({ status: "Active" });
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await subjectAPI.getAll();
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  const loadExam = async () => {
    try {
      const response = await examAPI.getById(id);
      if (response.data.success) {
        const exam = response.data.data;
        setFormData({
          examName: exam.examName,
          examType: exam.examType,
          terminalNumber: exam.terminalNumber || 1,
          academicYear: exam.academicYear,
          classes: exam.classes?.map((c) => c._id || c) || [],
          startDate: exam.startDate ? exam.startDate.split("T")[0] : "",
          endDate: exam.endDate ? exam.endDate.split("T")[0] : "",
          status: exam.status,
          routine: exam.routine || [],
          remarks: exam.remarks || "",
        });
      }
    } catch (error) {
      console.error("Error loading exam:", error);
      setToast({
        open: true,
        message: "Failed to load exam",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClassChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      classes: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleRoutineEntryChange = (e) => {
    const { name, value } = e.target;
    setRoutineEntry((prev) => ({
      ...prev,
      [name]: name === 'subjects'
        ? (typeof value === 'string' ? value.split(',') : value)
        : value,
    }));
  };

  const addRoutineEntry = () => {
    if (
      !routineEntry.class ||
      !routineEntry.subjects ||
      routineEntry.subjects.length === 0 ||
      !routineEntry.examDate
    ) {
      setToast({
        open: true,
        message: "Please select class, at least one subject, and exam date",
        severity: "warning",
      });
      return;
    }

    // Helper function to add minutes to time string (HH:MM format)
    const addMinutesToTime = (time, minutes) => {
      const [hours, mins] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + mins + minutes;
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMins = totalMinutes % 60;
      return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    };

    // Create routine entries for all selected subjects
    const newEntries = [];
    let currentStartTime = routineEntry.startTime;

    routineEntry.subjects.forEach((subjectId) => {
      const currentEndTime = addMinutesToTime(currentStartTime, routineEntry.duration);

      newEntries.push({
        class: routineEntry.class,
        subject: subjectId,
        examDate: routineEntry.examDate,
        startTime: currentStartTime,
        endTime: currentEndTime,
        duration: routineEntry.duration,
      });

      // For next subject, add 15 minutes break after current exam ends
      currentStartTime = addMinutesToTime(currentEndTime, 15);
    });

    setFormData((prev) => ({
      ...prev,
      routine: [...prev.routine, ...newEntries],
    }));

    setToast({
      open: true,
      message: `${newEntries.length} exam schedule(s) added successfully`,
      severity: "success",
    });

    // Reset form
    setRoutineEntry({
      class: "",
      subjects: [],
      examDate: "",
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
    });
  };

  const removeRoutineEntry = (index) => {
    setFormData((prev) => ({
      ...prev,
      routine: prev.routine.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.examName.trim()) {
      setToast({
        open: true,
        message: "Exam name is required",
        severity: "error",
      });
      return;
    }
    if (formData.classes.length === 0) {
      setToast({
        open: true,
        message: "Select at least one class",
        severity: "error",
      });
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setToast({
        open: true,
        message: "Start and end dates are required",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = isEdit
        ? await examAPI.update(id, formData)
        : await examAPI.create(formData);

      if (response.data.success) {
        setToast({
          open: true,
          message: `Exam ${isEdit ? "updated" : "created"} successfully!`,
          severity: "success",
        });
        setTimeout(() => navigate("/dashboard/exams"), 1500);
      }
    } catch (error) {
      console.error("Error saving exam:", error);
      setToast({
        open: true,
        message:
          error.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} exam`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getClassName = (classId) => {
    const cls = classes.find((c) => c._id === classId);
    return cls?.className || classId;
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s._id === subjectId);
    return subject?.subjectName || subjectId;
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/exams")}
          sx={{
            mb: 2,
            color: "text.secondary",
            "&:hover": { bgcolor: alpha("#1976d2", 0.05) },
          }}
        >
          Back to Exams
        </Button>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          {isEdit ? "Edit Exam" : "Create New Exam"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit
            ? "Update exam details and routine"
            : "Schedule a new exam with routine"}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "primary.main" }}
            >
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Exam Name"
                  name="examName"
                  value={formData.examName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., First Terminal Examination 2081"
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  label="Academic Year"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  options={ACADEMIC_YEARS}
                  allowNone={false}
                />
              </Grid>

              <Grid size={{ xs: 12, md: formData.examType === "Terminal" ? 4 : 6 }}>
                <Select
                  label="Exam Type"
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  options={EXAM_TYPES}
                  allowNone={false}
                />
              </Grid>

              {formData.examType === "Terminal" && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Select
                    label="Terminal Number"
                    name="terminalNumber"
                    value={formData.terminalNumber}
                    onChange={handleChange}
                    options={[1, 2, 3, 4]}
                    allowNone={false}
                    helperText="Select terminal examination number"
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, md: formData.examType === "Terminal" ? 4 : 6 }}>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={EXAM_STATUS}
                  allowNone={false}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid size={12}>
                <Select
                  label="Select Classes"
                  name="classes"
                  value={formData.classes}
                  onChange={handleClassChange}
                  options={classes}
                  multiple
                  required
                  allowNone={false}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={getClassName(value)}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Exam Routine Builder */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <CalendarIcon color="primary" />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                Exam Routine
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Build the exam schedule by adding subjects for each class. You can select multiple subjects for the same day - times will auto-increment with 15-minute breaks.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: alpha("#e3f2fd", 0.3),
                borderColor: "primary.light",
                mb: 3,
              }}
            >
              <Grid container spacing={2} alignItems="flex-end">
                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                  <Select
                    label="Class"
                    name="class"
                    value={routineEntry.class}
                    onChange={handleRoutineEntryChange}
                    options={formData.classes.map((classId) => {
                      const cls = classes.find((c) => c._id === classId);
                      return {
                        label: cls?.className || classId,
                        value: classId,
                      };
                    })}
                    size="small"
                    placeholder="Select class"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                  <Select
                    label="Subjects (Multiple)"
                    name="subjects"
                    value={routineEntry.subjects}
                    onChange={handleRoutineEntryChange}
                    options={subjects}
                    multiple
                    size="small"
                    placeholder="Select subjects"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={getSubjectName(value)}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500, height: 20, fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Date"
                    name="examDate"
                    type="date"
                    value={routineEntry.examDate}
                    onChange={handleRoutineEntryChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Start Time"
                    name="startTime"
                    type="time"
                    value={routineEntry.startTime}
                    onChange={handleRoutineEntryChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="End Time"
                    name="endTime"
                    type="time"
                    value={routineEntry.endTime}
                    onChange={handleRoutineEntryChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3, md: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Minutes"
                    name="duration"
                    type="number"
                    value={routineEntry.duration}
                    onChange={handleRoutineEntryChange}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3, md: 1 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={addRoutineEntry}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {formData.routine.length > 0 && (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha("#1976d2", 0.05) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.routine.map((entry, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Chip
                            label={getClassName(entry.class)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {getSubjectName(entry.subject)}
                        </TableCell>
                        <TableCell>
                          {new Date(entry.examDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {entry.startTime} - {entry.endTime}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${entry.duration} min`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeRoutineEntry(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {formData.routine.length === 0 && (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: alpha("#f5f5f5", 0.5),
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No routine entries added yet. Use the form above to add exam
                  schedules.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Remarks */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "primary.main" }}
            >
              Additional Notes
            </Typography>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Any additional notes or instructions for this exam..."
              variant="outlined"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Paper
          sx={{
            p: 3,
            boxShadow: 2,
            borderRadius: 2,
            bgcolor: alpha("#f5f5f5", 0.5),
          }}
        >
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/exams")}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={loading}
              sx={{ minWidth: 160 }}
            >
              {isEdit ? "Update Exam" : "Create Exam"}
            </Button>
          </Box>
        </Paper>
      </form>

      <Toast
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
