import React, { useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  ManageAccounts as ManageAccountsIcon,
  PeopleAlt as PeopleAltIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Button, QueryState, Toast } from '../../components/common';
import { DashboardCard, PageHeader, StatCard } from '../../components/dashboard';
import { useQueryStatus, useSystemOverview } from '../../hooks';
import { formatBSDate } from '../../utils/nepaliDate';

const formatDateTime = (value) => {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return `${formatBSDate(date)} ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export default function SuperAdminDashboardHome() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const overviewQuery = useSystemOverview();
  const { data: overview = null, error, isInitialLoading, isRefreshing } = useQueryStatus(overviewQuery);

  const users = overview?.users || {};
  const provisioning = overview?.provisioning || {};
  const recentUsers = overview?.recentUsers || [];

  return (
    <QueryState
      isLoading={isInitialLoading}
      isRefreshing={isRefreshing}
      error={error}
      loadingText="Loading system dashboard..."
      minHeight={320}
    >
    <Box>
      <PageHeader
        title="System <em>Dashboard</em>"
        action={(
          <Button
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => navigate('/superadmin/provisioning')}
          >
            Open Provisioning
          </Button>
        )}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        SuperAdmin follows the same dashboard structure as school operations, but the surface stays tight for now: account governance, provisioning, and role visibility.
      </Alert>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Users"
            value={users.total || 0}
            icon={<ManageAccountsIcon sx={{ fontSize: 20 }} />}
            iconBg="primary.light"
            iconColor="primary.main"
            emoji="👥"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Active Accounts"
            value={users.active || 0}
            icon={<AdminPanelSettingsIcon sx={{ fontSize: 20 }} />}
            iconBg="success.light"
            iconColor="success.main"
            emoji="✅"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Teacher Accounts"
            value={`${provisioning.teacherAccounts || 0}/${provisioning.activeTeachers || 0}`}
            icon={<PeopleAltIcon sx={{ fontSize: 20 }} />}
            iconBg="#EEF3FF"
            iconColor="#1B4FD8"
            emoji="👨‍🏫"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Parent Accounts"
            value={`${provisioning.parentAccounts || 0}/${provisioning.activeFamilies || 0}`}
            icon={<PersonAddAlt1Icon sx={{ fontSize: 20 }} />}
            iconBg="warning.light"
            iconColor="warning.main"
            emoji="👨‍👩‍👧"
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <DashboardCard title="Control Surface" hover={false}>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 2, lineHeight: 1.7 }}>
              Accounts are created in two ways now. Top-level system roles stay under manual SuperAdmin registration. Teacher and parent logins are provisioned from their existing school records so credentials stay tied to the actual teacher or family profile.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
              <Chip label={`${users.byRole?.SuperAdmin || 0} SuperAdmins`} color="primary" size="small" />
              <Chip label={`${users.byRole?.Admin || 0} Admins`} size="small" />
              <Chip label={`${users.byRole?.Teacher || 0} Teachers`} size="small" />
              <Chip label={`${users.byRole?.Parent || 0} Parents`} size="small" />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
              <Button variant="outlined" onClick={() => navigate('/superadmin/users')}>
                Open Users
              </Button>
              <Button onClick={() => navigate('/superadmin/provisioning')}>
                Generate Teacher / Parent Login
              </Button>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <DashboardCard title="Delivery Channels" hover={false}>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  SMS
                </Typography>
                <Chip
                  label={provisioning.smsConfigured ? 'Configured' : 'Not Configured'}
                  color={provisioning.smsConfigured ? 'success' : 'default'}
                  size="small"
                  variant={provisioning.smsConfigured ? 'filled' : 'outlined'}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Email
                </Typography>
                <Chip
                  label={provisioning.emailConfigured ? 'Configured' : 'Not Configured'}
                  color={provisioning.emailConfigured ? 'success' : 'default'}
                  size="small"
                  variant={provisioning.emailConfigured ? 'filled' : 'outlined'}
                />
              </Box>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.7 }}>
                Provisioning always generates a one-time temporary password. Delivery can go through Aakash SMS, SMTP email, or both when configured on the backend.
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={12}>
          <DashboardCard title="Recent Accounts" hover={false}>
            {recentUsers.length === 0 ? (
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                No users created yet.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((account) => (
                    <TableRow key={account._id} hover>
                      <TableCell>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                          {account.email || 'No email'}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          {account.phoneNumber || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>{account.role}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={account.isActive ? 'Active' : 'Inactive'}
                          color={account.isActive ? 'success' : 'default'}
                          variant={account.isActive ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>{formatDateTime(account.lastLogin)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DashboardCard>
        </Grid>
      </Grid>

      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
    </QueryState>
  );
}
