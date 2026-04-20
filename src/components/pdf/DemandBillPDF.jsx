import React from 'react';
import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer';
import { formatRs, numberToWords } from './pdfUtils';
import { formatBSDateShort } from '../../utils/nepaliDate';

// School logo — served from /public
const LOGO_SRC = `${process.env.PUBLIC_URL}/logo.png`;

// ── Brand palette ────────────────────────────────────────────────────────────
const C = {
  primary: '#1A3C7A',
  mid:     '#2E5EAA',
  tint:    '#5A7AAF',
  bg:      '#EDF2F9',
  rowAlt:  '#F5F7FB',
  success: '#388E3C',
  white:   '#FFFFFF',
  text:    '#000000',
};

const ML = 35; // horizontal margin

const S = StyleSheet.create({
  page: { backgroundColor: C.white, paddingBottom: 20 },
  accent: { height: 4, backgroundColor: C.primary },

  // Letterhead
  lhWrap:    { paddingHorizontal: ML, paddingTop: 14, paddingBottom: 6 },
  lhRow:     { flexDirection: 'row', alignItems: 'center' },
  logo:      { width: 44, height: 44, objectFit: 'contain' },
  lhTextCol: { flex: 1, alignItems: 'center' },
  lhSpacer:  { width: 44 },
  schoolName:{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'center' },
  lhSub:     { fontSize: 9.5, textAlign: 'center', color: C.text, marginTop: 2 },
  lhEstd:    { fontSize: 9, textAlign: 'center', color: C.text, marginTop: 1 },
  divider:   { height: 1.5, backgroundColor: C.mid, marginHorizontal: ML, marginBottom: 10 },

  // Bill title row
  titleRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg,
                borderWidth: 1, borderColor: C.primary,
                marginHorizontal: ML, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 8 },
  titleLeft:  { width: 150 },
  titleCenter:{ flex: 1, alignItems: 'center' },
  titleRight: { width: 90, alignItems: 'flex-end' },
  billNoTxt:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.primary },
  titleTxt:   { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary },
  dateTxt:    { fontSize: 10, color: C.text },

  // Student info section
  sxWrap:     { paddingHorizontal: ML, marginBottom: 6 },
  sxBar:      { height: 1, backgroundColor: C.tint, marginBottom: 5 },
  sxLabel:    { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 4 },
  sxHeadRow:  { flexDirection: 'row', marginBottom: 2 },
  sxHeadTxt:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.primary },
  sxRow:      { flexDirection: 'row', marginBottom: 1 },
  sxName:     { fontSize: 9, color: C.text, width: 250 },
  sxClass:    { fontSize: 9, color: C.text, width: 100 },
  sxRoll:     { fontSize: 9, color: C.text, width: 80 },
  feeMonthTx: { fontSize: 9, color: C.text, marginTop: 4, marginBottom: 10 },

  // Fee table
  tblWrap:   { marginHorizontal: ML },
  tblAccent: { height: 1, backgroundColor: C.primary, marginBottom: 5 },
  tblHead:   { flexDirection: 'row', backgroundColor: C.mid, paddingVertical: 4, paddingHorizontal: 8 },
  tblHeadTx: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white },
  tblRow:    { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8,
               borderWidth: 0.5, borderColor: C.tint },
  tblRowAlt: { backgroundColor: C.rowAlt },
  tblSN:     { width: 22, fontSize: 8, color: C.text },
  tblDesc:   { flex: 1, fontSize: 8, color: C.text },
  tblAmt:    { width: 80, fontSize: 8, color: C.text, textAlign: 'right' },

  // Total rows
  totalRow:   { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8,
                backgroundColor: C.bg, borderWidth: 1, borderColor: C.primary },
  totalLabel: { flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.primary },
  totalAmt:   { width: 80, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'right' },

  advRow:    { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8,
               backgroundColor: C.rowAlt, borderWidth: 0.5, borderColor: C.tint },
  advLabel:  { flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.text },
  advAmt:    { width: 80, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.success, textAlign: 'right' },

  gtRow:     { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8,
               backgroundColor: C.primary },
  gtLabel:   { flex: 1, fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white },
  gtAmt:     { width: 80, fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'right' },

  // In words
  inWords: { paddingHorizontal: ML, marginTop: 8, fontSize: 8, color: C.text },

  // Signatures
  sigWrap:  { flexDirection: 'row', paddingHorizontal: ML, marginTop: 16 },
  sigBlock: { flex: 1, alignItems: 'center' },
  sigLine:  { width: '80%', borderBottomWidth: 1, borderBottomColor: C.primary, marginBottom: 4 },
  sigLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#555555' },

  // Footer
  footerBar: { height: 1, backgroundColor: C.tint, marginHorizontal: ML, marginTop: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between',
               paddingHorizontal: ML, paddingTop: 5 },
  footerTx:  { fontSize: 7, color: '#999999' },
});

/**
 * DemandBillPDF — frontend-generated demand cash bill.
 *
 * Props:
 *   family              { familyId, primaryContact: { name, mobile } }
 *   students            [{ name, currentClass: { className }, rollNumber }]
 *   outstandingCharges  FeeTransaction[] where status !== 'Paid', sorted oldest first
 *   totalDue            number
 *   advance             number
 *   billRef             string
 *   generatedAt         Date
 */
export default function DemandBillPDF({
  family,
  students = [],
  outstandingCharges = [],
  totalDue = 0,
  advance = 0,
  billRef,
  generatedAt = new Date(),
}) {
  const grandTotal = totalDue - advance;
  const dateStr = formatBSDateShort(generatedAt);

  // One row per outstanding charge — exact count, no padding
  const particulars = outstandingCharges.map((c) => ({
    description: c.description || 'Fee',
    amount: c.chargeAmount - (c.settledAmount || 0),
    academicYear: c.academicYear || '',
  }));

  const totalCharged = particulars.reduce((s, p) => s + p.amount, 0);

  // ── Dynamic page height ──────────────────────────────────────────────────
  // BASE_H: all fixed chrome (letterhead+logo, divider, title row,
  //         student-section headers, family line, table header+accent,
  //         three total rows, in-words, sigs, footer, paddings).
  // STUD_H: per student row in info table.
  // ROW_H:  per fee row in the particulars table.
  // BUFFER: safety margin so content never clips.
  const BASE_H  = 400;
  const STUD_H  = 12;
  const ROW_H   = 18;
  const BUFFER  = 40;
  const pageH   = Math.max(
    BASE_H + students.length * STUD_H + particulars.length * ROW_H + BUFFER,
    340,
  );

  return (
    <Document>
      <Page size={{ width: 595.28, height: pageH }} style={S.page}>
        {/* Top accent */}
        <View style={S.accent} />

        {/* Letterhead — logo | centered text | spacer (keeps text truly centered) */}
        <View style={S.lhWrap}>
          <View style={S.lhRow}>
            <Image src={LOGO_SRC} style={S.logo} />
            <View style={S.lhTextCol}>
              <Text style={S.schoolName}>SHINING STAR ENGLISH SCHOOL</Text>
              <Text style={S.lhSub}>Yangwarak-4, Tharpu, Panchthar</Text>
              <Text style={S.lhEstd}>Estd: 2051 B.S.  |  PAN: [PAN]  |  Phone: [Phone]</Text>
            </View>
            <View style={S.lhSpacer} />
          </View>
        </View>
        <View style={S.divider} />

        {/* Bill title row */}
        <View style={S.titleRow}>
          <View style={S.titleLeft}>
            <Text style={S.billNoTxt}>Bill Ref: {billRef || '—'}</Text>
          </View>
          <View style={S.titleCenter}>
            <Text style={S.titleTxt}>DEMAND CASH BILL</Text>
          </View>
          <View style={S.titleRight}>
            <Text style={S.dateTxt}>Date: {dateStr}</Text>
          </View>
        </View>

        {/* Student info */}
        <View style={S.sxWrap}>
          <View style={S.sxBar} />
          <Text style={S.sxLabel}>Student Information</Text>
          <View style={S.sxHeadRow}>
            <Text style={[S.sxHeadTxt, { width: 250 }]}>Name</Text>
            <Text style={[S.sxHeadTxt, { width: 100 }]}>Class</Text>
            <Text style={[S.sxHeadTxt, { width: 80 }]}>Roll No</Text>
          </View>
          {students.map((s, i) => (
            <View key={i} style={S.sxRow}>
              <Text style={S.sxName}>{s.name}</Text>
              <Text style={S.sxClass}>{s.currentClass?.className || 'N/A'}</Text>
              <Text style={S.sxRoll}>{s.rollNumber || ''}</Text>
            </View>
          ))}
          {students.length === 0 && (
            <Text style={{ fontSize: 8, color: '#666666' }}>No students in family</Text>
          )}
          <Text style={S.feeMonthTx}>
            Family: {family?.familyId}{'  ·  '}Contact: {family?.primaryContact?.name} ({family?.primaryContact?.mobile || '—'})
          </Text>
        </View>

        {/* Fee table */}
        <View style={S.tblWrap}>
          <View style={S.tblAccent} />
          <View style={S.tblHead}>
            <Text style={[S.tblHeadTx, { width: 22 }]}>S.N.</Text>
            <Text style={[S.tblHeadTx, { flex: 1 }]}>Particulars</Text>
            <Text style={[S.tblHeadTx, { width: 80, textAlign: 'right' }]}>Amount (Rs.)</Text>
          </View>

          {/* Exact rows — no padding */}
          {particulars.length === 0 ? (
            <View style={S.tblRow}>
              <Text style={[S.tblSN]}>—</Text>
              <Text style={[S.tblDesc, { color: '#999999' }]}>No outstanding charges</Text>
              <Text style={S.tblAmt} />
            </View>
          ) : (
            particulars.map((row, i) => (
              <View key={i} style={[S.tblRow, i % 2 !== 0 && S.tblRowAlt]}>
                <Text style={S.tblSN}>{i + 1}</Text>
                <Text style={S.tblDesc}>
                  {row.description}{row.academicYear ? ` (${row.academicYear})` : ''}
                </Text>
                <Text style={S.tblAmt}>{formatRs(row.amount)}</Text>
              </View>
            ))
          )}

          {/* Totals */}
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>Total Amount</Text>
            <Text style={S.totalAmt}>{formatRs(totalCharged)}</Text>
          </View>
          <View style={S.advRow}>
            <Text style={S.advLabel}>Advance / Credit</Text>
            <Text style={S.advAmt}>{advance > 0 ? `(${formatRs(advance)})` : ''}</Text>
          </View>
          <View style={S.gtRow}>
            <Text style={S.gtLabel}>GRAND TOTAL</Text>
            <Text style={S.gtAmt}>{formatRs(grandTotal)}</Text>
          </View>
        </View>

        {/* In words */}
        <Text style={S.inWords}>
          In Words: {numberToWords(Math.floor(grandTotal))}
        </Text>

        {/* Signatures */}
        <View style={S.sigWrap}>
          {['Received By', 'Accountant', 'Principal'].map((label) => (
            <View key={label} style={S.sigBlock}>
              <View style={S.sigLine} />
              <Text style={S.sigLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={S.footerBar} />
        <View style={S.footerRow}>
          <Text style={S.footerTx}>This is a computer-generated bill.</Text>
          <Text style={S.footerTx}>www.shiningstarenglish.school</Text>
        </View>

        {/* Bottom accent */}
        <View style={[S.accent, { marginTop: 8 }]} />
      </Page>
    </Document>
  );
}
