import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
  LockReset as LockResetIcon,
  Sms as SmsIcon,
} from '@mui/icons-material';
import { Button, Dialog, Input, Select, Toast } from '../../components/common';
import { DashboardCard, PageHeader } from '../../components/dashboard';
import { authAPI } from '../../services/api';
import { formatBSDate } from '../../utils/nepaliDate';

const TARGET_TYPE_OPTIONS = [
  { label: 'Teachers', value: 'Teacher' },
  { label: 'Parents', value: 'Parent' },
];

const ACCOUNT_FILTER_OPTIONS = [
  { label: 'All Records', value: '' },
  { label: 'Needs Login', value: 'missing' },
  { label: 'Has Login', value: 'existing' },
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

export default function SuperAdminProvisioning() {
  const [targetType, setTargetType] = useState('Teacher');
  const [accountFilter, setAccountFilter] = useState('');
  const [search, setSearch] = useState('');
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [sendSMS, setSendSMS] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadTargets();
  }, [targetType, accountFilter, search]);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const response = await authAPI.getSystemOverview();

      if (response.data.success) {
        setOverview(response.data.data);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Failed to load provisioning config',
        severity: 'error',
      });
    }
  };

  const loadTargets = async () => {
    try {
      setLoading(true);
      const params = {
        targetType,
        status: 'Active',
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (accountFilter === 'missing') {
        params.hasAccount = false;
      }

      if (accountFilter === 'existing') {
        params.hasAccount = true;
      }

      const response = await authAPI.getProvisionTargets(params);
      if (response.data.success) {
        setTargets(response.data.data || []);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Failed to load provisioning targets',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const provisioningConfig = overview?.provisioning || {};
  const stats = useMemo(() => ({
    total: targets.length,
    withAccount: targets.filter((item) => item.hasAccount).length,
    missingAccount: targets.filter((item) => !item.hasAccount).length,
  }), [targets]);

  const openProvisionDialog = (target) => {
    setSelectedTarget(target);
    setSendSMS(Boolean(provisioningConfig.smsConfigured && target.phoneNumber));
    setSendEmail(Boolean(provisioningConfig.emailConfigured && target.email));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (submitting) {
      return;
    }

    setDialogOpen(false);
    setSelectedTarget(null);
  };

  const handleProvision = async () => {
    if (!selectedTarget) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await authAPI.provisionAccount({
        targetType: selectedTarget.targetType,
        targetId: selectedTarget.targetId,
        sendSMS,
        sendEmail,
      });

      if (response.data.success) {
        setResult(response.data.data);
        setDialogOpen(false);
        await Promise.all([loadTargets(), loadOverview()]);

        const channelFailures = (response.data.data.delivery?.channels || [])
          .filter((channel) => channel.status !== 'sent');

        setToast({
          open: true,
          message: channelFailures.length > 0
            ? 'Account generated, but one or more delivery channels need fallback.'
            : 'Account generated and credentials delivered successfully.',
          severity: channelFailures.length > 0 ? 'warning' : 'success',
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Failed to provision account',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!result?.temporaryPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.temporaryPassword);
      setToast({
        open: true,
        message: 'Temporary password copied to clipboard',
        severity: 'success',
      });
    } catch {
      setToast({
        open: true,
        message: 'Unable to copy the temporary password',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <PageHeader title="Account <em>Provisioning</em>" />

      <Alert severity="info" sx={{ mb: 3 }}>
        This module provisions logins only for existing teacher and family records. SuperAdmin can create the account, reset it later, and push the temporary password through SMS, email, or manual fallback.
      </Alert>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardCard title="Provision Filters" hover={false}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '0.9fr 0.9fr 1.2fr auto' }, alignItems: 'end' }}>
              <Select
                label="Target Type"
                name="targetType"
                value={targetType}
                onChange={(event) => setTargetType(event.target.value)}
                options={TARGET_TYPE_OPTIONS}
                allowNone={false}
              />
              <Select
                label="Account Filter"
                name="accountFilter"
                value={accountFilter}
                onChange={(event) => setAccountFilter(event.target.value)}
                options={ACCOUNT_FILTER_OPTIONS}
                allowNone={false}
              />
              <Input
                label="Search"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={targetType === 'Teacher' ? 'Teacher name, ID, email, phone' : 'Family ID, parent name, email, phone'}
              />
              <Button variant="outlined" onClick={() => { setSearch(''); setAccountFilter(''); }}>
                Reset
              </Button>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardCard title="Delivery Readiness" hover={false}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              <Chip
                icon={<SmsIcon />}
                label={provisioningConfig.smsConfigured ? 'SMS Ready' : 'SMS Not Configured'}
                color={provisioningConfig.smsConfigured ? 'success' : 'default'}
                size="small"
                variant={provisioningConfig.smsConfigured ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<EmailIcon />}
                label={provisioningConfig.emailConfigured ? 'Email Ready' : 'Email Not Configured'}
                color={provisioningConfig.emailConfigured ? 'success' : 'default'}
                size="small"
                variant={provisioningConfig.emailConfigured ? 'filled' : 'outlined'}
              />
            </Box>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.7 }}>
              A temporary password is always generated. If any channel is unavailable, SuperAdmin still gets a one-time manual fallback in the response panel below.
            </Typography>
          </DashboardCard>
        </Grid>
      </Grid>

      {result && (
        <DashboardCard title="Latest Provision Result" hover={false} sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary' }}>
                  {result.target?.name}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {result.user?.role} account {result.action}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyPassword}
              >
                Copy Password
              </Button>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', mb: 0.75 }}>
                Temporary Password
              </Typography>
              <Typography sx={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: 'text.primary' }}>
                {result.temporaryPassword}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 1 }}>
              {(result.delivery?.channels || []).length === 0 ? (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  No delivery channel was selected. Share the password manually.
                </Typography>
              ) : (result.delivery?.channels || []).map((channel) => (
                <Box
                  key={`${channel.channel}-${channel.recipient || 'manual'}`}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                      {channel.channel}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {channel.recipient || 'No recipient'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={channel.status}
                      size="small"
                      color={channel.status === 'sent' ? 'success' : 'warning'}
                      variant={channel.status === 'sent' ? 'filled' : 'outlined'}
                    />
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {channel.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DashboardCard>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
        <Chip label={`${stats.total} records`} size="small" />
        <Chip label={`${stats.missingAccount} without login`} color="warning" size="small" />
        <Chip label={`${stats.withAccount} with login`} color="success" size="small" />
      </Box>

      <DashboardCard title={`${targetType} Directory`} hover={false}>
        {loading ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Account State</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {targets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No matching records found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : targets.map((target) => (
                  <TableRow key={target.targetId} hover>
                    <TableCell>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {target.name}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                        {target.relation || target.role}
                      </Typography>
                    </TableCell>
                    <TableCell>{target.code}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '13px' }}>{target.email || 'No email'}</Typography>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                        {target.phoneNumber || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={target.hasAccount ? (target.linkedUser?.isActive ? 'Ready' : 'Inactive Account') : 'Missing Login'}
                        size="small"
                        color={target.hasAccount ? (target.linkedUser?.isActive ? 'success' : 'warning') : 'default'}
                        variant={target.hasAccount ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>{formatLastSeen(target.linkedUser?.lastLogin)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<LockResetIcon />}
                        onClick={() => openProvisionDialog(target)}
                      >
                        {target.hasAccount ? 'Reset & Send' : 'Create Login'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardCard>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        title={selectedTarget?.hasAccount ? 'Reset Credentials' : 'Create Login'}
        maxWidth="sm"
      >
        {selectedTarget && (
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <Alert severity="info">
              A new temporary password will be generated for {selectedTarget.name}. Existing credentials will stop working once this completes.
            </Alert>

            <Box sx={{ display: 'grid', gap: 0.75 }}>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Delivery target</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>{selectedTarget.name}</Typography>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {selectedTarget.email || 'No email'} • {selectedTarget.phoneNumber || 'No phone'}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 0.75 }}>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                Delivery channels
              </Typography>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={sendSMS}
                    onChange={(event) => setSendSMS(event.target.checked)}
                    disabled={!provisioningConfig.smsConfigured || !selectedTarget.phoneNumber}
                  />
                )}
                label="Send via SMS"
              />
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={sendEmail}
                    onChange={(event) => setSendEmail(event.target.checked)}
                    disabled={!provisioningConfig.emailConfigured || !selectedTarget.email}
                  />
                )}
                label="Send via Email"
              />
              {!provisioningConfig.smsConfigured && (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  SMS is not configured on the backend.
                </Typography>
              )}
              {!provisioningConfig.emailConfigured && (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  Email is not configured on the backend.
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={closeDialog} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleProvision} loading={submitting}>
                {selectedTarget.hasAccount ? 'Reset Account' : 'Create Account'}
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>

      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
  );
}
