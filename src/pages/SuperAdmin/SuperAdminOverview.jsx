import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import {
  AdminPanelSettings as SuperAdminIcon,
  ManageAccounts as ManageAccountsIcon,
  LockPerson as LockPersonIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { Button, Select, Toast } from '../../components/common';
import { ROLE_PERMISSIONS, ROLES } from '../../config/permissions';
import { useAuth } from '../../context/AuthContext';
import { useQueryStatus, useToggleUserStatus, useUsers } from '../../hooks';
import { formatBSDate } from '../../utils/nepaliDate';

const ROLE_OPTIONS = [
  { label: 'All Roles', value: '' },
  { label: 'SuperAdmin', value: ROLES.SUPER_ADMIN },
  { label: 'Admin', value: ROLES.ADMIN },
  { label: 'Teacher', value: ROLES.TEACHER },
  { label: 'Parent', value: ROLES.PARENT },
];

const ROLE_META = {
  [ROLES.SUPER_ADMIN]: {
    label: 'SuperAdmin',
    summary: 'Owns user access, role assignment, permission policy, and account state.',
    highlights: ['Users', 'Roles', 'Permissions', 'Access State'],
  },
  [ROLES.ADMIN]: {
    label: 'Admin',
    summary: 'Runs school operations across students, families, fees, inventory, and notifications.',
    highlights: ['Operations', 'School Data', 'Academic Setup'],
  },
  [ROLES.TEACHER]: {
    label: 'Teacher',
    summary: 'Handles classroom execution, attendance, marks, and report-related work.',
    highlights: ['Attendance', 'Marks', 'Progress Reports'],
  },
  [ROLES.PARENT]: {
    label: 'Parent',
    summary: 'Gets view access to their own family, children, fees, and academic records.',
    highlights: ['Own Family', 'Own Children', 'Read Only'],
  },
};

const getPermissionSummary = (role) => {
  const permissions = ROLE_PERMISSIONS[role] || {};
  const modules = Object.keys(permissions);
  const actions = [...new Set(modules.flatMap((module) => permissions[module] || []))];

  if (role === ROLES.SUPER_ADMIN) {
    return 'System control only';
  }

  return `${modules.length} modules • ${actions.length} action types`;
};

const formatLastSeen = (value) => {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${formatBSDate(date)} ${time}`;
};

export default function SuperAdminOverview() {
  const { user } = useAuth();
  const [roleFilter, setRoleFilter] = useState('');
  const [workingUserId, setWorkingUserId] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const params = roleFilter ? { role: roleFilter } : {};
  const usersQuery = useUsers(params);
  const { data: users = [], error, isInitialLoading, isRefreshing } = useQueryStatus(usersQuery, {
    hasData: (data) => Array.isArray(data),
  });
  const toggleUserStatusMutation = useToggleUserStatus();

  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load system users',
        severity: 'error',
      });
    }
  }, [error]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((item) => item.isActive).length,
    superAdmins: users.filter((item) => item.role === ROLES.SUPER_ADMIN).length,
    admins: users.filter((item) => item.role === ROLES.ADMIN).length,
  }), [users]);

  const handleToggleStatus = async (account) => {
    try {
      setWorkingUserId(account._id);
      const nextState = !account.isActive;

      await toggleUserStatusMutation.mutateAsync({
        userId: account._id,
        isActive: nextState,
      });
      setToast({
        open: true,
        message: `User ${nextState ? 'activated' : 'deactivated'} successfully`,
        severity: 'success',
      });
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to update user status',
        severity: 'error',
      });
    } finally {
      setWorkingUserId('');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          System Control
        </Typography>
        <Typography variant="body2" color="text.secondary">
          SuperAdmin owns user access, role distribution, and permission governance. This portal stays separate from the school operations dashboard.
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Public self-registration is disabled. User creation, role assignment, and account state are controlled by SuperAdmin only.
      </Alert>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#0A0F1E', 0.03) }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
                </Box>
                <ManageAccountsIcon color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#16A34A', 0.06) }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Active Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>{stats.active}</Typography>
                </Box>
                <VerifiedUserIcon sx={{ color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#1B4FD8', 0.06) }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">SuperAdmins</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>{stats.superAdmins}</Typography>
                </Box>
                <SuperAdminIcon color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#D97706', 0.06) }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Admins</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>{stats.admins}</Typography>
                </Box>
                <LockPersonIcon sx={{ color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.values(ROLES).map((role) => (
          <Grid key={role} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {ROLE_META[role]?.label || role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {ROLE_META[role]?.summary || 'Role access profile'}
                    </Typography>
                  </Box>
                  <Chip label={getPermissionSummary(role)} size="small" color={role === ROLES.SUPER_ADMIN ? 'primary' : 'default'} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(ROLE_META[role]?.highlights || []).map((item) => (
                    <Chip key={item} label={item} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                User Access Directory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lightweight control view for roles and account status.
              </Typography>
            </Box>
            <Box sx={{ minWidth: 220 }}>
              <Select
                label="Role Filter"
                name="roleFilter"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                options={ROLE_OPTIONS}
                allowNone={false}
              />
            </Box>
          </Box>

          {isRefreshing && <LinearProgress sx={{ mb: 2 }} />}
          {isInitialLoading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">Loading users...</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Profile Link</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">No users found for this filter.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : users.map((account) => {
                    const isCurrentUser = String(account._id) === String(user?.id);
                    return (
                      <TableRow key={account._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {account.email || 'No email'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {account.phoneNumber || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={account.role}
                            size="small"
                            color={account.role === ROLES.SUPER_ADMIN ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{account.profileModel || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={account.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            color={account.isActive ? 'success' : 'default'}
                            variant={account.isActive ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>{formatLastSeen(account.lastLogin)}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant={account.isActive ? 'outlined' : 'contained'}
                            color={account.isActive ? 'warning' : 'success'}
                            disabled={workingUserId === account._id || isCurrentUser}
                            onClick={() => handleToggleStatus(account)}
                          >
                            {isCurrentUser
                              ? 'Current User'
                              : account.isActive
                                ? 'Deactivate'
                                : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
  );
}
