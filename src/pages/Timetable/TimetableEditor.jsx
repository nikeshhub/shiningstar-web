import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { Button, Select, Toast } from "../../components/common";
import { PageHeader } from "../../components/dashboard";
import {
  classAPI,
  subjectAPI,
  teacherAPI,
  timetableAPI,
} from "../../hooks/reactQueryApi";
import { useAuth } from "../../context/AuthContext";

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

const getPeriodTimes = () => {
  const startMinutes = 10 * 60; // 10:00
  const periodLength = 40;
  const breakAfterSecond = 15;
  const lunchAfterFourth = 40;

  let cursor = startMinutes;
  const times = {};

  PERIODS.forEach((period) => {
    const start = cursor;
    const end = cursor + periodLength;
    times[period] = {
      start,
      end,
      label: `${formatTime(start)}–${formatTime(end)}`,
    };
    cursor = end;

    if (period === 2) cursor += breakAfterSecond;
    if (period === 4) cursor += lunchAfterFourth;
  });

  return times;
};

const formatTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hh = h % 12 === 0 ? 12 : h % 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

export default function TimetableEditor() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [grid, setGrid] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const canEditTimetable = user?.role === "Admin";

  const periodTimes = useMemo(() => getPeriodTimes(), []);
  useEffect(() => {
    classAPI
      .getAll({ status: "Active" })
      .then((res) => {
        if (res.data.success) setClasses(res.data.data);
      })
      .catch((err) => console.error("Error loading classes:", err));

    if (canEditTimetable) {
      subjectAPI
        .getAll()
        .then((res) => {
          if (res.data.success) setSubjects(res.data.data);
        })
        .catch((err) => console.error("Error loading subjects:", err));

      teacherAPI
        .getAll({ status: "Active" })
        .then((res) => {
          if (res.data.success) setTeachers(res.data.data);
        })
        .catch((err) => console.error("Error loading teachers:", err));
    }
  }, [canEditTimetable]);

  useEffect(() => {
    setLoading(true);
    timetableAPI
      .getAll()
      .then((res) => {
        if (res.data.success) {
          const nextGrid = {};
          classes.forEach((cls) => {
            nextGrid[cls._id] = {};
            PERIODS.forEach((p) => {
              nextGrid[cls._id][p] = { subjects: [], teacher: "" };
            });
          });

          res.data.data.forEach((slot) => {
            const classId = slot.class?._id || slot.class;
            if (!nextGrid[classId]) return;
            nextGrid[classId][slot.period] = {
              subjects: (slot.subjects || []).map(
                (subject) => subject?._id || subject || "",
              ),
              subjectLabels: (slot.subjects || []).map(
                (subject) =>
                  subject?.subjectName ||
                  subject?.subjectCode ||
                  subject ||
                  "Subject",
              ),
              teacher: slot.teacher?._id || slot.teacher || "",
              teacherName: slot.teacher?.name || "",
            };
          });
          setGrid(nextGrid);
        }
      })
      .catch((err) => console.error("Error loading timetable:", err))
      .finally(() => setLoading(false));
  }, [classes]);

  const handleCellChange = (classId, period, field, value) => {
    setGrid((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [period]: {
          ...prev[classId]?.[period],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!canEditTimetable) {
      return;
    }

    const slots = [];
    const teacherUsage = {};
    const subjectUsage = {};

    for (const cls of classes) {
      for (const period of PERIODS) {
        const cell = grid[cls._id]?.[period] || { subjects: [], teacher: "" };
        if (
          cell.teacher &&
          Array.isArray(cell.subjects) &&
          cell.subjects.length > 0
        ) {
          const teacherId = cell.teacher;
          if (!teacherUsage[period]) teacherUsage[period] = {};
          if (
            teacherUsage[period][teacherId] &&
            teacherUsage[period][teacherId] !== cls._id
          ) {
            setToast({
              open: true,
              severity: "error",
              message: `Teacher "${teacherMap[teacherId] || "Unknown"}" is already assigned in Period ${period} for ${classMap[teacherUsage[period][teacherId]] || "another class"}.`,
            });
            return;
          }
          teacherUsage[period][teacherId] = cls._id;

          if (!subjectUsage[cls._id]) subjectUsage[cls._id] = {};
          const repeat = cell.subjects.find(
            (subjectId) =>
              subjectUsage[cls._id][subjectId] &&
              subjectUsage[cls._id][subjectId] !== period,
          );
          if (repeat) {
            setToast({
              open: true,
              severity: "error",
              message: `Subject "${subjectMap[repeat] || "Unknown"}" is repeated in ${classMap[cls._id] || "this class"}.`,
            });
            return;
          }
          cell.subjects.forEach((subjectId) => {
            subjectUsage[cls._id][subjectId] = period;
          });

          slots.push({
            class: cls._id,
            period,
            teacher: cell.teacher,
            subjects: cell.subjects,
          });
        }
      }
    }

    try {
      setLoading(true);
      await timetableAPI.setAll({ slots });
      setToast({
        open: true,
        message: "Timetable saved successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error saving timetable:", err);
      setToast({
        open: true,
        message: err.response?.data?.message || "Failed to save timetable",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toIdString = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value._id) return String(value._id);
      if (value.id) return String(value.id);
    }
    return String(value);
  };

  const normalizeSubject = (raw, subjectLookup) => {
    if (!raw) {
      return { value: "", label: "" };
    }

    const embedded =
      raw && typeof raw === "object" && raw.subject ? raw.subject : raw;
    const value = toIdString(
      (embedded &&
        typeof embedded === "object" &&
        (embedded._id || embedded.id)) ||
      (raw && typeof raw === "object" && (raw._id || raw.id)) ||
      (typeof embedded === "string" ? embedded : ""),
    );

    const fromLookup = value ? subjectLookup[value] : null;
    const source =
      fromLookup ||
      (embedded && typeof embedded === "object" ? embedded : null) ||
      (raw && typeof raw === "object" ? raw : null) ||
      null;

    const subjectName =
      source?.label || source?.subjectName || source?.name || "";
    const subjectCode = source?.subjectCode || source?.code || "";
    const label = [subjectName, subjectCode ? `(${subjectCode})` : ""]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      value,
      label: label || (value ? String(value) : "Unknown Subject"),
    };
  };

  const subjectLookup = Object.fromEntries(
    subjects
      .map((s) => normalizeSubject(s, {}))
      .filter((s) => s.value)
      .map((s) => [toIdString(s.value), s]),
  );

  const subjectOptions = Object.values(subjectLookup).map((s) => ({
    label: s.label,
    value: s.value,
  }));
  const subjectLabelMap = Object.fromEntries(
    subjectOptions.map((s) => [s.value, s.label]),
  );
  const classSubjectOptions = Object.fromEntries(
    classes.map((cls) => [
      cls._id,
      (cls.subjects || [])
        .map((s) => normalizeSubject(s, subjectLookup))
        .filter((s) => s.value),
    ]),
  );

  const teacherOptions = teachers.map((t) => ({ label: t.name, value: t._id }));
  const classMap = Object.fromEntries(classes.map((c) => [c._id, c.className]));
  const teacherMap = Object.fromEntries(teachers.map((t) => [t._id, t.name]));
  const subjectMap = Object.fromEntries(
    subjectOptions.map((s) => [s.value, s.label]),
  );

  const getTeacherOptionsForCell = (classId, period) => {
    const usedByOtherClasses = new Set(
      classes
        .filter((cls) => cls._id !== classId)
        .map((cls) => toIdString(grid[cls._id]?.[period]?.teacher))
        .filter(Boolean),
    );

    return teacherOptions.filter(
      (opt) => !usedByOtherClasses.has(toIdString(opt.value)),
    );
  };

  const getSubjectOptionsForCell = (classId, period) => {
    const rowOptions = classSubjectOptions[classId] || subjectOptions;
    const selectedInCurrentCell = new Set(
      (grid[classId]?.[period]?.subjects || []).map((s) => toIdString(s)),
    );
    const usedInOtherPeriods = new Set(
      PERIODS
        .filter((p) => p !== period)
        .flatMap((p) => grid[classId]?.[p]?.subjects || [])
        .map((s) => toIdString(s))
        .filter(Boolean),
    );

    return rowOptions.filter((opt) => {
      const optionId = toIdString(opt.value);
      return (
        !usedInOtherPeriods.has(optionId) || selectedInCurrentCell.has(optionId)
      );
    });
  };

  return (
    <Box>
      <PageHeader
        title={canEditTimetable ? "<em>Timetable</em>" : "My <em>Timetable</em>"}
        action={
          canEditTimetable ? (
            <Button onClick={handleSave} loading={loading}>
              Save Timetable
            </Button>
          ) : null
        }
      />

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.100", width: 200 }}
              >
                Class
              </TableCell>
              {PERIODS.map((p) => (
                <TableCell
                  key={p}
                  sx={{ fontWeight: 600, bgcolor: "grey.100", minWidth: 220 }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      P{p}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {periodTimes[p].label}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls._id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{cls.className}</TableCell>
                {PERIODS.map((period) => (
                  <TableCell key={period}>
                    <Grid container spacing={1}>
                      <Grid size={12}>
                        {canEditTimetable ? (
                          <TextField
                            select
                            fullWidth
                            label="Subjects"
                            value={grid[cls._id]?.[period]?.subjects || []}
                            onChange={(e) =>
                              handleCellChange(
                                cls._id,
                                period,
                                "subjects",
                                e.target.value,
                              )
                            }
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{
                              multiple: true,
                              displayEmpty: true,
                              renderValue: (selected) =>
                                (selected?.length || 0) === 0 ? (
                                  <span style={{ color: "#9e9e9e" }}>
                                    Select subjects
                                  </span>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((val) => {
                                      const selectedId = toIdString(val);
                                      const rowOptions = getSubjectOptionsForCell(
                                        cls._id,
                                        period,
                                      );
                                      const opt = rowOptions.find(
                                        (o) => toIdString(o.value) === selectedId,
                                      );
                                      return (
                                        <Chip
                                          key={selectedId}
                                          label={
                                            opt?.label ||
                                            subjectLabelMap[selectedId] ||
                                            selectedId
                                          }
                                          size="small"
                                        />
                                      );
                                    })}
                                  </Box>
                                ),
                            }}
                            size="small"
                          >
                            {getSubjectOptionsForCell(cls._id, period).map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              minHeight: 32,
                              alignItems: "center",
                            }}
                          >
                            {(grid[cls._id]?.[period]?.subjectLabels || [])
                              .length > 0 ? (
                              grid[cls._id][period].subjectLabels.map(
                                (label, index) => (
                                  <Chip
                                    key={`${label}-${index}`}
                                    label={label}
                                    size="small"
                                  />
                                ),
                              )
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                Free period
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Grid>
                      <Grid size={12}>
                        {canEditTimetable ? (
                          <Select
                            label="Teacher"
                            name={`teacher-${cls._id}-${period}`}
                            value={grid[cls._id]?.[period]?.teacher || ""}
                            onChange={(e) =>
                              handleCellChange(
                                cls._id,
                                period,
                                "teacher",
                                e.target.value,
                              )
                            }
                            options={getTeacherOptionsForCell(cls._id, period)}
                            allowNone
                            noneLabel="Unassigned"
                            placeholder="Select Teacher"
                            size="small"
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            {grid[cls._id]?.[period]?.teacherName || "—"}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Toast
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
