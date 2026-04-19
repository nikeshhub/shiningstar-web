import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Dialog,
  Select,
  Button,
  Input,
  Toast,
  FormAutocompleteSelect,
} from "../../components/common";
import { inventoryAPI, studentAPI } from "../../services/api";

export default function DistributeBookSetDialog({ open, onClose, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // rows: { item, checked, quantity, alreadyGiven }
  const [rows, setRows] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (!open) return;
    setSelectedStudentId("");
    setBooks([]);
    setRows([]);
    setPaymentStatus("Pending");
    studentAPI
      .getAll({ status: "Active" })
      .then((res) => {
        if (res.data.success) setStudents(res.data.data);
      })
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!selectedStudentId) {
      setBooks([]);
      setRows([]);
      return;
    }

    const student = students.find((s) => s._id === selectedStudentId);
    const classId = student?.currentClass?._id || student?.currentClass;
    if (!classId) {
      setBooks([]);
      setRows([]);
      return;
    }

    setBooksLoading(true);

    Promise.all([
      inventoryAPI.getAll({ itemType: "Books" }),
      inventoryAPI.getStudentDistributions(selectedStudentId),
    ])
      .then(([booksRes, distRes]) => {
        if (!booksRes.data.success) return;

        const alreadyGivenIds = new Set(
          (distRes.data.success ? distRes.data.data.distributions : []).map(
            (d) => d.item?._id || d.item,
          ),
        );

        const classBooks = booksRes.data.data.filter((item) =>
          item.applicableClasses?.some((c) => (c._id || c) === classId),
        );

        setBooks(classBooks);
        setRows(
          classBooks.map((item) => {
            const alreadyGiven = alreadyGivenIds.has(item._id);
            return { item, checked: !alreadyGiven, quantity: 1, alreadyGiven };
          }),
        );
      })
      .catch(() => {})
      .finally(() => setBooksLoading(false));
  }, [selectedStudentId, students]);

  const selectedStudent = students.find((s) => s._id === selectedStudentId);
  const className = selectedStudent?.currentClass?.className || "—";

  const allChecked = rows.length > 0 && rows.every((r) => r.checked);
  const someChecked = rows.some((r) => r.checked);
  const alreadyGivenCount = rows.filter((r) => r.alreadyGiven).length;

  const toggleAll = () => {
    const nextChecked = !allChecked;
    setRows((prev) =>
      prev.map((r) =>
        r.item.quantity === 0 ? r : { ...r, checked: nextChecked },
      ),
    );
  };

  const toggleRow = (index) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, checked: !r.checked } : r)),
    );
  };

  const updateQty = (index, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, quantity: qty } : r)),
    );
  };

  const checkedRows = rows.filter((r) => r.checked);
  const grandTotal = checkedRows.reduce(
    (sum, r) => sum + r.quantity * (r.item.unitPrice || 0),
    0,
  );

  const handleSubmit = async () => {
    if (!selectedStudentId) {
      setToast({
        open: true,
        message: "Please select a student",
        severity: "error",
      });
      return;
    }
    if (checkedRows.length === 0) {
      setToast({
        open: true,
        message: "Select at least one book to distribute",
        severity: "error",
      });
      return;
    }

    const overStock = checkedRows.find((r) => r.quantity > r.item.quantity);
    if (overStock) {
      setToast({
        open: true,
        message: `Insufficient stock for "${overStock.item.itemName}" (available: ${overStock.item.quantity})`,
        severity: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      await Promise.all(
        checkedRows.map((r) =>
          inventoryAPI.distribute({
            studentId: selectedStudentId,
            itemId: r.item._id,
            quantity: r.quantity,
            paymentStatus,
            linkToFee: paymentStatus === "Linked to Fee",
          }),
        ),
      );
      setToast({
        open: true,
        message: `${checkedRows.length} book(s) distributed successfully!`,
        severity: "success",
      });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to distribute books",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const studentOptions = students.map((s) => ({
    label: `${s.name}${s.currentClass?.className ? ` — ${s.currentClass.className}` : ""}`,
    value: s._id,
  }));

  return (
    <>
      <Dialog
        variant="form"
        title="Distribute Book Set"
        open={open}
        onClose={onClose}
        maxWidth="md"
      >
        <Box sx={{ pt: 1 }}>
          {/* Student picker */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <FormAutocompleteSelect
                label="Student"
                name="studentId"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                options={studentOptions}
                required
                placeholder="Type to search student..."
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "primary.light",
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Class
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {className}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Duplicate warning */}
          {alreadyGivenCount > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {alreadyGivenCount} book
              {alreadyGivenCount > 1 ? "s have" : " has"} already been given to
              this student and {alreadyGivenCount > 1 ? "are" : "is"} unchecked
              by default. Check them only if distributing a replacement.
            </Alert>
          )}

          {/* Book checklist */}
          {booksLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {!booksLoading && selectedStudentId && books.length === 0 && (
            <Box
              sx={{
                py: 3,
                textAlign: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                No books are tagged to this student's class yet.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tag books to classes when adding/editing inventory items.
              </Typography>
            </Box>
          )}

          {!booksLoading && rows.length > 0 && (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked && !allChecked}
                        onChange={toggleAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      In Stock
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Qty
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Unit Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    const subtotal = row.quantity * (row.item.unitPrice || 0);
                    const outOfStock = row.item.quantity === 0;
                    return (
                      <TableRow
                        key={row.item._id}
                        sx={{
                          opacity: outOfStock ? 0.5 : 1,
                          bgcolor:
                            row.alreadyGiven && !outOfStock
                              ? "warning.lighter"
                              : "inherit",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={row.checked}
                            onChange={() => toggleRow(index)}
                            disabled={outOfStock}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.item.itemName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              mt: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {outOfStock && (
                              <Chip
                                label="Out of Stock"
                                color="error"
                                size="small"
                              />
                            )}
                            {row.alreadyGiven && (
                              <Chip
                                label="Already Given"
                                color="warning"
                                size="small"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            color={
                              row.item.quantity <= row.item.minimumQuantity
                                ? "warning.main"
                                : "text.primary"
                            }
                            fontWeight={500}
                          >
                            {row.item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 90 }}>
                          <Input
                            name="qty"
                            type="number"
                            value={row.quantity}
                            onChange={(e) => updateQty(index, e.target.value)}
                            disabled={!row.checked || outOfStock}
                            inputProps={{
                              min: 1,
                              max: row.item.quantity,
                              style: {
                                textAlign: "center",
                                padding: "6px 8px",
                              },
                            }}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 1 },
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            Rs. {row.item.unitPrice || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={row.checked ? 600 : 400}
                            color={
                              row.checked ? "text.primary" : "text.disabled"
                            }
                          >
                            Rs. {row.checked ? subtotal.toFixed(2) : "—"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Footer controls */}
          {rows.length > 0 && (
            <>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Select
                    label="Payment Status"
                    name="paymentStatus"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    options={["Pending", "Paid", "Linked to Fee"]}
                    required
                    allowNone={false}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "success.light",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="success.dark">
                      {checkedRows.length} of {rows.length} books selected
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="success.dark"
                    >
                      Rs. {grandTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              loading={submitting}
              disabled={checkedRows.length === 0 || !selectedStudentId}
            >
              Distribute{" "}
              {checkedRows.length > 0 ? `(${checkedRows.length} books)` : ""}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Toast
        toast={toast}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
