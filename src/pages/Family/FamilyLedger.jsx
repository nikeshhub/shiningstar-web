import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { familyAPI, feeAPI } from '../../services/api';
import { Toast, BSDatePicker } from '../../components/common';
import { formatBSDate } from '../../utils/nepaliDate';
import DemandBillPDF from '../../components/pdf/DemandBillPDF';
import PaymentReceiptPDF from '../../components/pdf/PaymentReceiptPDF';
import { openPDF } from '../../components/pdf/pdfUtils';

/**
 * FamilyLedger — dedicated page for a family's fee ledger.
 *
 * Lives at /dashboard/families/:id/ledger.
 * Demand bill and payment receipts are generated entirely in the browser using
 * @react-pdf/renderer — no server-side PDF storage.
 */
export default function FamilyLedger() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [family, setFamily] = useState(null);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);

  useEffect(() => {
    if (id) {
      loadFamily();
      loadLedger();
    }
  }, [id]);

  const loadFamily = async () => {
    try {
      const response = await familyAPI.getById(id);
      if (response.data.success) {
        setFamily(response.data.data);
        setStudents(response.data.data.students || []);
      }
    } catch (error) {
      console.error('Error loading family:', error);
      setToast({ open: true, message: 'Error loading family', severity: 'error' });
    }
  };

  const loadLedger = async (params = {}) => {
    try {
      const response = await feeAPI.getLedger(id, params);
      if (response.data.success) {
        setTransactions(response.data.data.transactions || []);
        setCurrentBalance(response.data.data.currentBalance);
      }
    } catch (error) {
      console.error('Error loading family ledger:', error);
    }
  };

  const handleApplyFilter = () => {
    const params = {};
    if (filter.startDate) params.startDate = filter.startDate;
    if (filter.endDate) params.endDate = filter.endDate;
    loadLedger(params);
  };

  const handleClearFilter = () => {
    setFilter({ startDate: '', endDate: '' });
    loadLedger();
  };

  // Outstanding charges (not fully paid) — these become the demand bill particulars
  const outstandingCharges = transactions.filter(
    (t) => t.transactionType === 'Charge' && t.status !== 'Paid',
  );

  // Most recent charge — used for bill ref
  const latestCharge = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .find((t) => t.transactionType === 'Charge');

  const hasDues = currentBalance && (currentBalance.totalDue > 0 || outstandingCharges.length > 0);

  // ── PDF handlers ────────────────────────────────────────────────────────────

  const handleViewDemandBill = async () => {
    if (!family) return;
    setPdfLoading(true);
    try {
      await openPDF(
        <DemandBillPDF
          family={family}
          students={students}
          outstandingCharges={outstandingCharges}
          totalDue={currentBalance?.totalDue || 0}
          advance={currentBalance?.totalAdvance || 0}
          billRef={latestCharge?.billNumber}
          generatedAt={new Date()}
        />,
      );
    } catch (err) {
      console.error('PDF generation failed:', err);
      setToast({ open: true, message: 'Failed to generate demand bill PDF', severity: 'error' });
    } finally {
      setPdfLoading(false);
    }
  };

  const handleViewReceipt = async (txn) => {
    if (!family) return;
    setReceiptLoadingId(txn._id);
    try {
      await openPDF(
        <PaymentReceiptPDF
          family={family}
          students={students}
          transaction={txn}
        />,
      );
    } catch (err) {
      console.error('Receipt PDF generation failed:', err);
      setToast({ open: true, message: 'Failed to generate receipt PDF', severity: 'error' });
    } finally {
      setReceiptLoadingId(null);
    }
  };

  // ── Balance delta per row ────────────────────────────────────────────────────
  const deltaFor = (txn) => {
    if (txn.transactionType === 'Charge') return txn.chargeAmount || 0;
    if (txn.transactionType === 'Payment') return -(txn.paidAmount || 0);
    return 0;
  };

  if (!family) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/families/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Family
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Fee Ledger — {family.familyId}
        </Typography>
      </Box>

      {/* Summary card */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Primary Contact
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {family.primaryContact?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {family.primaryContact?.mobile}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {currentBalance && (
                <Box sx={{ textAlign: { md: 'right' } }}>
                  {currentBalance.totalDue > 0 ? (
                    <>
                      <Typography variant="h4" color="error">
                        Rs. {currentBalance.totalDue}
                      </Typography>
                      <Typography color="text.secondary">Total Due (बाँकी)</Typography>
                    </>
                  ) : currentBalance.totalAdvance > 0 ? (
                    <>
                      <Typography variant="h4" color="success.main">
                        Rs. {currentBalance.totalAdvance}
                      </Typography>
                      <Typography color="text.secondary">Advance (अग्रिम)</Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="success.main">
                        Clear
                      </Typography>
                      <Typography color="text.secondary">No Dues</Typography>
                    </>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/charge`)}
          color="error"
        >
          Add Family Charge
        </Button>
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/payment`)}
          color="success"
        >
          Add Family Payment
        </Button>

        {/* Demand bill — only shown when there are outstanding charges */}
        {hasDues && (
          <Button
            variant="outlined"
            startIcon={pdfLoading
              ? <CircularProgress size={16} color="inherit" />
              : <PictureAsPdfIcon />}
            onClick={handleViewDemandBill}
            disabled={pdfLoading}
          >
            {pdfLoading ? 'Generating…' : 'View Demand Bill'}
          </Button>
        )}
      </Stack>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 2, boxShadow: 1, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Typography variant="body2" sx={{ minWidth: 130, fontWeight: 600 }}>
            Filter Ledger:
          </Typography>
          <Box sx={{ minWidth: 200 }}>
            <BSDatePicker
              label="Start Date (BS)"
              name="startDate"
              size="small"
              value={filter.startDate}
              onChange={(e) => setFilter((f) => ({ ...f, startDate: e.target.value }))}
            />
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <BSDatePicker
              label="End Date (BS)"
              name="endDate"
              size="small"
              value={filter.endDate}
              onChange={(e) => setFilter((f) => ({ ...f, endDate: e.target.value }))}
            />
          </Box>
          <Button variant="contained" size="small" onClick={handleApplyFilter}>
            Apply
          </Button>
          <Button variant="text" size="small" onClick={handleClearFilter}>
            Clear
          </Button>
        </Stack>
      </Paper>

      {/* Ledger Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ p: 2, bgcolor: alpha('#1976d2', 0.05), fontWeight: 600 }}>
          Family Fee Ledger (बही खाता){'  '}
          <Typography component="span" variant="caption" color="text.secondary">
            — dates in Bikram Sambat
          </Typography>
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Date (मिति)</TableCell>
              <TableCell>Description (विवरण)</TableCell>
              <TableCell>Ref No.</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Charge (रकम)</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Δ</TableCell>
              <TableCell align="right">Due (बाँकी)</TableCell>
              <TableCell align="right">Advance</TableCell>
              <TableCell align="center">PDF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => {
              const delta = deltaFor(txn);
              const isCharge = txn.transactionType === 'Charge';
              const isPayment = txn.transactionType === 'Payment';
              const loadingReceipt = receiptLoadingId === txn._id;
              return (
                <TableRow key={txn._id} hover>
                  <TableCell>
                    <Tooltip title={formatBSDate(txn.date)} placement="top">
                      <span>{formatBSDate(txn.date)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{txn.description}</Typography>
                    {txn.feeBreakdown && txn.feeBreakdown.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                        {txn.feeBreakdown.map((fb, i) => (
                          <Chip
                            key={i}
                            label={`${fb.feeType}: ${fb.amount}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {txn.billNumber || '—'}
                    </Typography>
                    {txn.academicYear && (
                      <Typography variant="caption" color="text.secondary">
                        {txn.academicYear}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {isCharge && (
                      <Chip
                        label={txn.status || 'Unpaid'}
                        size="small"
                        color={
                          txn.status === 'Paid' ? 'success'
                            : txn.status === 'Partial' ? 'warning'
                              : 'error'
                        }
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 18 }}
                      />
                    )}
                    {isPayment && (
                      <Chip
                        label="Payment"
                        size="small"
                        color="success"
                        variant="filled"
                        sx={{ fontSize: '0.65rem', height: 18 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {txn.chargeAmount > 0 && (
                      <Typography color="error">{txn.chargeAmount}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {txn.paidAmount > 0 && (
                      <Typography color="success.main">{txn.paidAmount}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {delta !== 0 && (
                      <Typography color={delta > 0 ? 'error' : 'success.main'} fontWeight={600}>
                        {delta > 0 ? `+${delta}` : delta}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {txn.totalDue > 0 && (
                      <Typography color="error" fontWeight="bold">
                        {txn.totalDue}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {txn.totalAdvance > 0 && (
                      <Typography color="success.main" fontWeight="bold">
                        {txn.totalAdvance}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {/* Payment row → open receipt PDF */}
                    {isPayment && (
                      <Tooltip title="Open payment receipt">
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewReceipt(txn)}
                            disabled={loadingReceipt}
                          >
                            {loadingReceipt
                              ? <CircularProgress size={16} />
                              : <ReceiptIcon fontSize="small" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography color="text.secondary">No transactions yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
