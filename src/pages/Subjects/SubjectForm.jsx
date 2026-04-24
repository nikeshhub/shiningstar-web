import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  alpha,
  Paper,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { Button, QueryState, Toast, Select } from "../../components/common";
import { useCreateSubject, useQueryStatus, useSubject, useUpdateSubject } from "../../hooks";

const SUBJECT_TYPES = ["Major", "Minor"];

export default function SubjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    subjectType: "Major",
    creditHours: 5.0,
    writtenMarks: 50,
    practicalMarks: 50,
    fullMarks: 100,
    passMarks: 32,
    isOptional: false,
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const subjectQuery = useSubject(id);
  const {
    data: subjectData,
    error: subjectError,
    isInitialLoading: isSubjectLoading,
    isRefreshing: isSubjectRefreshing,
  } = useQueryStatus(subjectQuery);
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const isSubmitting =
    createSubjectMutation.isPending || updateSubjectMutation.isPending;

  useEffect(() => {
    if (subjectData) {
      setFormData(subjectData);
    }
  }, [subjectData]);

  useEffect(() => {
    if (subjectError) {
      setToast({
        open: true,
        message: subjectError.message || "Failed to load subject",
        severity: "error",
      });
    }
  }, [subjectError]);

  useEffect(() => {
    const total =
      Number(formData.writtenMarks) + Number(formData.practicalMarks);
    if (total !== formData.fullMarks) {
      setFormData((prev) => ({ ...prev, fullMarks: total }));
    }
  }, [formData.writtenMarks, formData.practicalMarks]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subjectName.trim()) {
      setToast({
        open: true,
        message: "Subject name is required",
        severity: "error",
      });
      return;
    }
    if (!formData.subjectCode.trim()) {
      setToast({
        open: true,
        message: "Subject code is required",
        severity: "error",
      });
      return;
    }

    try {
      if (isEdit) {
        await updateSubjectMutation.mutateAsync({ id, data: formData });
      } else {
        await createSubjectMutation.mutateAsync(formData);
      }
      setToast({
        open: true,
        message: `Subject ${isEdit ? "updated" : "created"} successfully!`,
        severity: "success",
      });
      setTimeout(() => navigate("/dashboard/subjects"), 1500);
    } catch (error) {
      console.error("Error saving subject:", error);
      setToast({
        open: true,
        message:
          error.message ||
          `Failed to ${isEdit ? "update" : "create"} subject`,
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/subjects")}
          sx={{
            mb: 2,
            color: "text.secondary",
            "&:hover": { bgcolor: alpha("#1976d2", 0.05) },
          }}
        >
          Back to Subjects
        </Button>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          {isEdit ? "Edit Subject" : "Create New Subject"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit
            ? "Update subject information and configuration"
            : "Add a new subject to the curriculum"}
        </Typography>
      </Box>

      <QueryState
        isLoading={isEdit && isSubjectLoading}
        isRefreshing={isEdit && isSubjectRefreshing}
        error={isEdit ? subjectError : null}
        loadingText="Loading subject details..."
        minHeight={320}
      >
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
                  label="Subject Name"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., English, Nepali, Mathematics"
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Subject Code"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ENG, NEP, MATH"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  label="Subject Type"
                  name="subjectType"
                  value={formData.subjectType}
                  onChange={handleChange}
                  options={SUBJECT_TYPES}
                  allowNone={false}
                  helperText="Major subjects: 5.0+, Minor subjects: 1.0-3.0 credit hours"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Credit Hours"
                  name="creditHours"
                  type="number"
                  value={formData.creditHours}
                  onChange={handleChange}
                  inputProps={{ step: 0.5, min: 1, max: 10 }}
                  helperText="Major subjects: 5.0+, Minor subjects: 1.0-3.0"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Marks Configuration */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
            >
              Marks Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure the marks distribution for written and practical
              components
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Written Marks"
                  name="writtenMarks"
                  type="number"
                  value={formData.writtenMarks}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  helperText="Theory/written exam component"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Practical Marks"
                  name="practicalMarks"
                  type="number"
                  value={formData.practicalMarks}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  helperText="Practical/oral exam component"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Full Marks"
                  name="fullMarks"
                  type="number"
                  value={formData.fullMarks}
                  disabled
                  variant="outlined"
                  helperText="Auto-calculated from written + practical"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#2e7d32",
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Pass Marks"
                  name="passMarks"
                  type="number"
                  value={formData.passMarks}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: formData.fullMarks }}
                  helperText="Minimum marks required to pass (typically 32% of full marks)"
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha("#2196f3", 0.05),
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: alpha("#2196f3", 0.2),
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Pass Percentage
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {formData.fullMarks > 0
                      ? (
                          (formData.passMarks / formData.fullMarks) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Optional Subject */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
            >
              Subject Options
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Additional configuration for this subject
            </Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isOptional"
                      checked={formData.isOptional}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      This is an <strong>optional subject</strong> (students can
                      choose not to take it)
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
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
              onClick={() => navigate("/dashboard/subjects")}
              disabled={isSubmitting || (isEdit && isSubjectLoading)}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={isEdit && isSubjectLoading}
              sx={{ minWidth: 160 }}
            >
              {isEdit ? "Update Subject" : "Create Subject"}
            </Button>
          </Box>
        </Paper>
        </form>
      </QueryState>

      <Toast
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
