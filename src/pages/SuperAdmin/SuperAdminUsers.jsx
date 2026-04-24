import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Toast } from '../../components/common';
import { DashboardCard, PageHeader } from '../../components/dashboard';
import { ROLES } from '../../config/permissions';
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

const formatLastSeen = (value) => {
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

export default function SuperAdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [workingUserId, setWorkingUserId] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const params = useMemo(() => {
    const next = {};
    if (roleFilter) next.role = roleFilter;
    if (search.trim()) next.search = search.trim();
    return next;
  }, [roleFilter, search]);
  const usersQuery = useUsers(params);
  const { data: users = [], error, isInitialLoading, isRefreshing } = useQueryStatus(usersQuery, {
    hasData: (data) => Array.isArray(data),
  });
  const toggleUserStatusMutation = useToggleUserStatus();

  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load users',
        severity: 'error',
      });
    }
  }, [error]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((item) => item.isActive).length,
    teachers: users.filter((item) => item.role === ROLES.TEACHER).length,
    parents: users.filter((item) => item.role === ROLES.PARENT).length,
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
      <PageHeader
        title="User <em>Accounts</em>"
        action={(
          <Button onClick={() => navigate('/superadmin/provisioning')}>
            Open Provisioning
          </Button>
        )}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        This page stays focused on account state and role visibility. Teacher and parent credential generation lives in the Provisioning section.
      </Alert>

      <DashboardCard title="Directory Filters" hover={false} sx={{ mb: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1.3fr 0.7fr auto' }, alignItems: 'end' }}>
          <Input
            label="Search"
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email, phone, or role"
          />
          <Select
            label="Role Filter"
            name="roleFilter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            options={ROLE_OPTIONS}
            allowNone={false}
          />
          <Button variant="outlined" onClick={() => { setSearch(''); setRoleFilter(''); }}>
            Reset
          </Button>
        </Box>
      </DashboardCard>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
        <Chip label={`${stats.total} users`} size="small" />
        <Chip label={`${stats.active} active`} color="success" size="small" />
        <Chip label={`${stats.teachers} teachers`} size="small" />
        <Chip label={`${stats.parents} parents`} size="small" />
      </Box>

      <DashboardCard title="Access Directory" hover={false}>
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
                  <TableCell sx={{ fontWeight: 600 }}>Linked Profile</TableCell>
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
      </DashboardCard>

      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
  );
}
