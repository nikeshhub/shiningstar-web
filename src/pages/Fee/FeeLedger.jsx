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
} from '@mui/material';
import {
  Add as AddIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { feeAPI } from '../../services/api';

export default function FeeLedger() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);

  useEffect(() => {
    if (studentId) {
      loadStudentLedger();
    }
  }, [studentId]);

  const loadStudentLedger = async () => {
    try {
      const response = await feeAPI.getLedger(studentId);
      if (response.data.success) {
        const { student: studentData, transactions: txns, currentBalance: balance } = response.data.data;
        setStudent(studentData);
        setTransactions(txns);
        setCurrentBalance(balance);
      }
    } catch (error) {
      console.error('Error loading ledger:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/students')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Fee Ledger (बही खाता)
        </Typography>
      </Box>

      {/* Student Info Card */}
      {student && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6">{student.name}</Typography>
                <Typography color="text.secondary">Student ID: {student.studentId}</Typography>
                <Typography color="text.secondary">
                  Class: {student.currentClass?.className}
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
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/dashboard/fee/ledger/${studentId}/charge`)}
          color="error"
        >
          Add Charge
        </Button>
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          onClick={() => navigate(`/dashboard/fee/ledger/${studentId}/payment`)}
          color="success"
        >
          Add Payment
        </Button>
        <Button variant="outlined" startIcon={<ReceiptIcon />}>
          Print Statement
        </Button>
      </Stack>

      {/* Ledger Table (Like Dad's Notebook) */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Date (मिति)</TableCell>
              <TableCell>Description (विवरण)</TableCell>
              <TableCell>Bill No</TableCell>
              <TableCell align="right">Charge (रकम)</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Due (बाँकी)</TableCell>
              <TableCell align="right">Advance (अग्रिम)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn, index) => (
              <TableRow key={txn._id} hover>
                <TableCell>{formatDate(txn.date)}</TableCell>
                <TableCell>
                  <Typography variant="body2">{txn.description}</Typography>
                  {txn.feeBreakdown && txn.feeBreakdown.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {txn.feeBreakdown.map(fb => `${fb.feeType}: ${fb.amount}`).join(', ')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{txn.billNumber || '-'}</TableCell>
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
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">No transactions yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
}
