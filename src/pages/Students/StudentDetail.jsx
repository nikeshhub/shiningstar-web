import React, { useState } from "react";
import { Box, Typography, Avatar, Chip, Divider } from "@mui/material";
import {
  Edit as EditIcon,
  BadgeOutlined as BadgeIcon,
  VerifiedUser as CertIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  DetailPage,
  DetailSection,
  DetailRow,
  StatusChip,
} from "../../components/common";
import { useQueryStatus, useStudent } from "../../hooks";
import { formatBSDate } from "../../utils/nepaliDate";
import { useAuth } from "../../context/AuthContext";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "#1976d2",
  "#388e3c",
  "#7b1fa2",
  "#d32f2f",
  "#f57c00",
  "#0288d1",
  "#00796b",
  "#455a64",
];

const avatarColor = (name = "") => {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "-";
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bcOpen, setBcOpen] = useState(false);
  const canManageStudent = user?.role === "Admin";
  const canViewFamilyFinancials = user?.role === "Admin";
  const studentQuery = useStudent(id);
  const { data: student = null, isInitialLoading } = useQueryStatus(studentQuery);

  if (isInitialLoading) return <DetailPage loading={true} />;

  if (!student) {
    return (
      <Box sx={{ textAlign: "center", pt: 10 }}>
        <Typography variant="h6" color="text.secondary">
          Student not found
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/dashboard/students")}>
          Back to Students
        </Button>
      </Box>
    );
  }

  return (
    <DetailPage
      title={student.name}
      backTo="/dashboard/students"
      loading={false}
      actions={canManageStudent ? (
        <Button
          startIcon={<EditIcon />}
          onClick={() => navigate(`/dashboard/students/edit/${id}`)}
        >
          Edit Student
        </Button>
      ) : null}
    >
      {/* ── Profile card ─────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          mb: 4,
          pb: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
        }}
      >
        {/* Left: meta */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BadgeIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {student.studentId}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StatusChip status={student.status} />
            <Chip
              label={student.currentClass?.className || "No Class"}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>
          {student.admissionDate && (
            <Typography variant="caption" color="text.secondary">
              Admitted: {formatBSDate(student.admissionDate)}
            </Typography>
          )}
        </Box>

        {/* Right: photo */}
        {student.photo ? (
          <Avatar
            src={student.photo}
            alt={student.name}
            sx={{
              width: 96,
              height: 96,
              boxShadow: 3,
              border: "3px solid",
              borderColor: "primary.light",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: avatarColor(student.name),
              fontSize: 32,
              fontWeight: 700,
              boxShadow: 3,
              letterSpacing: 1,
            }}
          >
            {getInitials(student.name)}
          </Avatar>
        )}
      </Box>

      {/* ── Basic Info ────────────────────────────────────────────── */}
      <DetailSection title="Basic Information">
        <DetailRow label="Student ID" value={student.studentId} />
        <DetailRow
          label="Status"
          value={<StatusChip status={student.status} />}
        />
        <DetailRow
          label="Date of Birth"
          value={formatBSDate(student.dateOfBirth)}
        />
        <DetailRow label="Age" value={calculateAge(student.dateOfBirth)} />
        <DetailRow label="Gender" value={student.gender} />
      </DetailSection>

      {/* ── Family Info ───────────────────────────────────────────── */}
      {student.family && (
        <DetailSection title="Family Information">
          <DetailRow label="Family ID" value={student.family.familyId} />
          <DetailRow
            label="Primary Contact Name"
            value={student.family.primaryContact?.name}
          />
          <DetailRow
            label="Relation"
            value={student.family.primaryContact?.relation}
          />
          <DetailRow
            label="Phone (Primary)"
            value={student.family.primaryContact?.mobile}
          />
          <DetailRow
            label="Email (Primary)"
            value={student.family.primaryContact?.email}
          />
          <DetailRow
            label="Secondary Contact Name"
            value={student.family.secondaryContact?.name}
          />
          <DetailRow
            label="Relation"
            value={student.family.secondaryContact?.relation}
          />
          <DetailRow
            label="Phone (Secondary)"
            value={student.family.secondaryContact?.mobile}
          />
          <DetailRow
            label="Email (Secondary)"
            value={student.family.secondaryContact?.email}
          />
          <DetailRow
            label="Address"
            value={student.family.address}
            colSpan={12}
          />
          {canViewFamilyFinancials && (
            <DetailRow
              label="View Family Details"
              value={
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    navigate(`/dashboard/families/${student.family._id}`)
                  }
                >
                  View Full Family
                </Button>
              }
            />
          )}
        </DetailSection>
      )}

      {/* ── Academic Info ─────────────────────────────────────────── */}
      <DetailSection title="Academic Information">
        <DetailRow
          label="Class"
          value={student.currentClass?.className || "-"}
        />
        <DetailRow label="Roll Number" value={student.rollNumber} />
        <DetailRow
          label="Admission Date"
          value={formatBSDate(student.admissionDate)}
        />
        <DetailRow label="Academic Year" value={student.academicYear} />
        <DetailRow label="Previous School" value={student.previousSchool} />
        <DetailRow label="Remarks" value={student.remarks} colSpan={12} />
      </DetailSection>

      {/* ── Family Fee Summary ────────────────────────────────────── */}
      {canViewFamilyFinancials && (
        <DetailSection title="Family Fee Summary">
          <DetailRow
            label="Total Due (Family)"
            value={
              student.family?.familyFeeBalance?.totalDue > 0 ? (
                <Typography color="error" sx={{ fontWeight: 600 }}>
                  Rs. {student.family.familyFeeBalance.totalDue}
                </Typography>
              ) : (
                "Rs. 0"
              )
            }
          />
          <DetailRow
            label="Total Advance (Family)"
            value={
              student.family?.familyFeeBalance?.totalAdvance > 0 ? (
                <Typography color="success.main" sx={{ fontWeight: 600 }}>
                  Rs. {student.family.familyFeeBalance.totalAdvance}
                </Typography>
              ) : (
                "Rs. 0"
              )
            }
          />
          <DetailRow
            label="Family Ledger"
            value={
              student.family?._id ? (
                <Typography
                  component="a"
                  href={`/dashboard/families/${student.family._id}/ledger`}
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  View Family Ledger ({student.family.familyId})
                </Typography>
              ) : (
                "—"
              )
            }
          />
        </DetailSection>
      )}

      {/* ── Documents ─────────────────────────────────────────────── */}
      {student.birthCertificate && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Documents
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}
              >
                <CertIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Birth Certificate
                </Typography>
              </Box>
              <Box
                onClick={() => setBcOpen(true)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: "divider",
                  width: 160,
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.50",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": { borderColor: "primary.main", boxShadow: 3 },
                }}
              >
                <Box
                  component="img"
                  src={student.birthCertificate}
                  alt="Birth Certificate"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                Click to view
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {bcOpen && (
        <Box
          onClick={() => setBcOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            bgcolor: "rgba(0,0,0,0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <Box
            component="img"
            src={student.birthCertificate}
            alt="Birth Certificate"
            sx={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 2,
              boxShadow: 10,
            }}
          />
        </Box>
      )}
    </DetailPage>
  );
}
