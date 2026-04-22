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
  Grid,
  Chip,
  Stack,
  Divider,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { feeAPI } from '../../hooks/reactQueryApi';
import { Toast } from '../../components/common';
import { formatBSDate, formatBSDateShort } from '../../utils/nepaliDate';

/**
 * BillPreview — HTML preview for a single fee transaction.
 *
 * Shows a Demand Cash-Bill layout for charges and a Payment Receipt layout
 * for payments. Mirrors the fields rendered in the PDF (see
 * server/src/utils/pdfGenerator.js) so what the parent sees here matches
 * what they'd download.
 *
 * Route: /dashboard/families/:id/bills/:txnId
 */
export default function BillPreview() {
  const navigate = useNavigate();
  const { id, txnId } = useParams();

  const [txn, setTxn] = useState(null);
  const [family, setFamily] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (txnId) loadTransaction();
  }, [txnId]);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await feeAPI.getTransaction(txnId);
      if (response.data.success) {
        setTxn(response.data.data.transaction);
        setFamily(response.data.data.family);
        setStudents(response.data.data.students || []);
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Failed to load transaction',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Print = open the actual stored PDF in a new tab so the browser's native
  // PDF viewer handles printing. Falls back to HTML print only when no PDF is
  // stored yet (edge case for very old transactions).
  const handlePrint = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      window.print();
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading…</Typography>
      </Box>
    );
  }

  if (!txn) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/ledger`)}
          sx={{ mb: 2 }}
        >
          Back to Ledger
        </Button>
        <Typography color="error">Transaction not found.</Typography>
        <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
      </Box>
    );
  }

  const isCharge = txn.transactionType === 'Charge';
  const pdfUrl = isCharge ? txn.billPdfUrl : txn.receiptPdfUrl;

  const totalAmount = isCharge ? (txn.chargeAmount || 0) : (txn.paidAmount || 0);
  const advanceAtTimeOfBill = Math.max(0, (txn.previousBalance || 0) * -1); // previousBalance is positive when due, negative when advance
  const grandTotal = isCharge
    ? Math.max(0, totalAmount - advanceAtTimeOfBill)
    : totalAmount;

  return (
    <Box>
      {/* Header + actions — hidden when printing */}
      <Box
        className="no-print"
        sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/ledger`)}
        >
          Back to Ledger
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          {isCharge ? 'Demand Cash-Bill Preview' : 'Payment Receipt Preview'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print
          </Button>
          {pdfUrl && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </Button>
          )}
        </Stack>
      </Box>

      {/* Bill sheet */}
      <Paper
        sx={{
          maxWidth: 780,
          mx: 'auto',
          p: { xs: 3, md: 5 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
        elevation={3}
      >
        {/* School Letterhead */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            SHINING STAR ENGLISH SCHOOL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Yangwarak-4, Tharpu, Panchthar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estd: 2051 · Province No. 1, Nepal
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bill Meta */}
        <Grid container sx={{ mb: 2 }} spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              {isCharge ? 'Bill No.' : 'Receipt No.'}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {txn.billNumber || txn._id?.slice(-8).toUpperCase()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Date (BS)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatBSDateShort(txn.date)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatBSDate(txn.date)}
            </Typography>
          </Grid>
        </Grid>

        {/* Type pill */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={isCharge ? 'Demand Cash-Bill' : 'Payment Receipt'}
            color={isCharge ? 'error' : 'success'}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Family info */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 1,
            bgcolor: alpha('#1976d2', 0.04),
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.15),
          }}
        >
          <Grid container spacing={1.5} sx={{ mb: students.length > 0 ? 1.5 : 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Family ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {family?.familyId || '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Contact
              </Typography>
              <Typography variant="body1">
                {family?.primaryContact?.name}{family?.primaryContact?.mobile ? ` · ${family.primaryContact.mobile}` : ''}
              </Typography>
            </Grid>
          </Grid>

          {/* All students in the family */}
          {students.length > 0 && (
            <>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Students
              </Typography>
              <Stack spacing={0.5}>
                {students.map((s) => (
                  <Box
                    key={s._id}
                    sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 160 }}>
                      {s.name}
                    </Typography>
                    <Chip
                      label={s.currentClass?.className || 'N/A'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                    {s.rollNumber && (
                      <Typography variant="caption" color="text.secondary">
                        Roll: {s.rollNumber}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </Box>

        {/* Description line */}
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          <strong>{isCharge ? 'Fees for:' : 'Description:'}</strong> {txn.description}
        </Typography>

        {/* Itemized table — for charges */}
        {isCharge && (
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700, width: 60 }}>S.No.</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Particulars</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Amount (Rs.)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(txn.feeBreakdown && txn.feeBreakdown.length > 0) ? (
                  txn.feeBreakdown.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{item.feeType}</TableCell>
                      <TableCell align="right">{Number(item.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>{txn.description}</TableCell>
                    <TableCell align="right">{Number(totalAmount).toFixed(2)}</TableCell>
                  </TableRow>
                )}

                <TableRow sx={{ bgcolor: alpha('#000', 0.02) }}>
                  <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                    Total Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {Number(totalAmount).toFixed(2)}
                  </TableCell>
                </TableRow>

                {advanceAtTimeOfBill > 0 && (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 600 }}>
                      Less: Advance
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                      − {advanceAtTimeOfBill.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}

                <TableRow sx={{ bgcolor: alpha('#1976d2', 0.08) }}>
                  <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                    Grand Total Payable
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                    Rs. {Number(grandTotal).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Payment receipt body */}
        {!isCharge && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">{txn.paymentMethod || 'Cash'}</Typography>
              </Grid>
              {txn.chequeNumber && (
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Cheque No.
                  </Typography>
                  <Typography variant="body1">{txn.chequeNumber}</Typography>
                </Grid>
              )}
              {txn.transactionReference && (
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Reference
                  </Typography>
                  <Typography variant="body1">{txn.transactionReference}</Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: alpha('#2e7d32', 0.08),
                    border: '1px solid',
                    borderColor: alpha('#2e7d32', 0.3),
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Amount Received
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    Rs. {Number(totalAmount).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Balance after this transaction */}
        <Box
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 1,
            bgcolor: alpha('#000', 0.03),
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              After this transaction
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {txn.totalDue > 0
                ? `Due: Rs. ${txn.totalDue}`
                : txn.totalAdvance > 0
                  ? `Advance: Rs. ${txn.totalAdvance}`
                  : 'Clear — no dues'}
            </Typography>
          </Box>
          {txn.remarks && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Remarks
              </Typography>
              <Typography variant="body2">{txn.remarks}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Signature row */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ borderTop: '1px solid', borderColor: 'text.secondary', pt: 0.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Received By
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ borderTop: '1px solid', borderColor: 'text.secondary', pt: 0.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Authorised Signature
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Print CSS: hide chrome, print just the sheet */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
