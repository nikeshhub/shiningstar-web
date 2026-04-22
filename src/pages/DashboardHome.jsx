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
import { studentAPI, feeAPI, classAPI } from '../hooks/reactQueryApi';
import { StatCard, DashboardCard, PageHeader } from '../components/dashboard';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeStudents: 0,
    totalClasses: 0,
    totalDues: 0,
  });

  useEffect(() => {
    loadStats();
  }, [user?.role]);

  const loadStats = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        studentAPI.getAll({ status: 'Active' }),
        classAPI.getAll({ status: 'Active' }),
      ]);

      let totalDues = 0;
      if (user?.role === 'Admin') {
        const duesRes = await feeAPI.getDuesList({ minAmount: 0 });
        totalDues = duesRes.data.data?.totalDues || 0;
      }

      setStats({
        activeStudents: studentsRes.data.data?.length || 0,
        totalClasses: classesRes.data.data?.length || 0,
        totalDues,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <Box>
      <PageHeader title={user?.role === 'Teacher' ? 'Teacher <em>Dashboard</em>' : 'Dashboard <em>Overview</em>'} />

      <Grid container spacing={2.5}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label={user?.role === 'Teacher' ? 'My Active Students' : 'Active Students'}
            value={stats.activeStudents}
            icon={<PeopleIcon sx={{ fontSize: 20 }} />}
            iconBg="primary.light"
            iconColor="primary.main"
            emoji="🎓"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label={user?.role === 'Teacher' ? 'My Classes' : 'Total Classes'}
            value={stats.totalClasses}
            icon={<SchoolIcon sx={{ fontSize: 20 }} />}
            iconBg="#EEF3FF"
            iconColor="#1B4FD8"
            emoji="📚"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label={user?.role === 'Teacher' ? 'Academic Scope' : 'Total Fee Dues'}
            value={user?.role === 'Teacher' ? 'Class-scoped' : `Rs. ${stats.totalDues.toLocaleString()}`}
            icon={<PaymentIcon sx={{ fontSize: 20 }} />}
            iconBg={user?.role === 'Teacher' ? 'primary.light' : 'error.light'}
            iconColor={user?.role === 'Teacher' ? 'primary.main' : 'error.main'}
            emoji={user?.role === 'Teacher' ? '✓' : '💰'}
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
              {user?.role === 'Teacher'
                ? 'आउनुभयो! तपाईं आफ्नो class teacher class, attendance, marks, timetable, and progress reports manage गर्न सक्नुहुनेछ।'
                : 'आउनुभयो! यस प्रणालीमा तपाईं विद्यालयको सम्पूर्ण व्यवस्थापन गर्न सक्नुहुनेछ।'}
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
                  {user?.role === 'Teacher'
                    ? 'विद्यार्थी सूची तपाईंको class teacher class मा मात्र सीमित छ'
                    : 'शुल्क व्यवस्थापन (बही खाता जस्तै - बाँकी र अग्रिम ट्र्याकिंग)'}
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
                  {user?.role === 'Teacher'
                    ? 'Fees, families, inventory, notifications, and teacher attendance admin-only छन्'
                    : 'सामग्री वितरण र सूचना प्रसारण'}
                </Typography>
              </Box>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
}
