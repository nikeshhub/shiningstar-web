import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { studentAPI, feeAPI, classAPI } from '../services/api';
import { StatCard, DashboardCard, PageHeader } from '../components/dashboard';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalClasses: 0,
    totalDues: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [studentsRes, classesRes, duesRes] = await Promise.all([
        studentAPI.getAll({ status: 'Active' }),
        classAPI.getAll({ status: 'Active' }),
        feeAPI.getDuesList({ minAmount: 0 }),
      ]);

      setStats({
        activeStudents: studentsRes.data.data?.length || 0,
        totalClasses: classesRes.data.data?.length || 0,
        totalDues: duesRes.data.data?.totalDues || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <Box>
      <PageHeader title="Dashboard <em>Overview</em>" />

      <Grid container spacing={2.5}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Active Students"
            value={stats.activeStudents}
            icon={<PeopleIcon sx={{ fontSize: 20 }} />}
            iconBg="primary.light"
            iconColor="primary.main"
            emoji="🎓"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Classes"
            value={stats.totalClasses}
            icon={<SchoolIcon sx={{ fontSize: 20 }} />}
            iconBg="#EEF3FF"
            iconColor="#1B4FD8"
            emoji="📚"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Fee Dues"
            value={`Rs. ${stats.totalDues.toLocaleString()}`}
            icon={<PaymentIcon sx={{ fontSize: 20 }} />}
            iconBg="error.light"
            iconColor="error.main"
            emoji="💰"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Attendance Today"
            value="95%"
            icon={<EventNoteIcon sx={{ fontSize: 20 }} />}
            iconBg="success.light"
            iconColor="success.main"
            change={2.5}
            emoji="✓"
          />
        </Grid>

        {/* Welcome Card */}
        <Grid size={12}>
          <DashboardCard
            title="Welcome to Shining Star"
            hover={false}
          >
            <Typography
              sx={{
                fontSize: '14px',
                color: 'text.secondary',
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              आउनुभयो! यस प्रणालीमा तपाईं विद्यालयको सम्पूर्ण व्यवस्थापन गर्न सक्नुहुनेछ।
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  विद्यार्थी व्यवस्थापन (भर्ना, प्रोफाइल, QR ID कार्ड)
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  शुल्क व्यवस्थापन (बही खाता जस्तै - बाँकी र अग्रिम ट्र्याकिंग)
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  हाजिरी, परीक्षा, अंक, र रिपोर्ट व्यवस्थापन
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  सामग्री वितरण र सूचना प्रसारण
                </Typography>
              </Box>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
}
