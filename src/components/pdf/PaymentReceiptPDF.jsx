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
  primary:   '#1A3C7A',
  mid:       '#2E5EAA',
  tint:      '#5A7AAF',
  bg:        '#EDF2F9',
  white:     '#FFFFFF',
  text:      '#000000',
  sub:       '#555555',
  // Paid card
  paidBg:    '#E8F5EE',
  paidBdr:   '#A8D5B5',
  paidTxt:   '#0F6E56',
  // Due card
  dueBg:     '#EDF2F9',
  dueBdr:    '#5A7AAF',
  dueTxt:    '#1A3C7A',
  // Balance card
  balPosBg:  '#FFF7ED',
  balPosBdr: '#F5C98A',
  balPosTxt: '#854F0B',
  balZeroBg: '#E8F5EE',
  balZeroBdr:'#A8D5B5',
  balZeroTxt:'#0F6E56',
  dash:      '#AAAAAA',
};

const ML = 32;

const S = StyleSheet.create({
  page: { backgroundColor: C.white, paddingVertical: 8 },

  // ── Per-copy wrapper ──────────────────────────────────────────────────────
  copy:        { marginHorizontal: 0, paddingBottom: 6 },
  copyLabel:   { flexDirection: 'row', justifyContent: 'flex-end',
                 paddingHorizontal: ML, paddingTop: 3 },
  copyLabelTx: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.sub,
                 borderWidth: 0.5, borderColor: C.tint,
                 paddingHorizontal: 6, paddingVertical: 2 },

  // ── Accent bar ────────────────────────────────────────────────────────────
  accent: { height: 4, backgroundColor: C.primary },

  // ── Letterhead ────────────────────────────────────────────────────────────
  lhWrap:    { paddingHorizontal: ML, paddingTop: 8, paddingBottom: 5 },
  lhRow:     { flexDirection: 'row', alignItems: 'center' },
  logo:      { width: 38, height: 38, objectFit: 'contain' },
  lhTextCol: { flex: 1, alignItems: 'center' },
  lhSpacer:  { width: 38 },
  schoolName:{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'center' },
  lhSub:     { fontSize: 8.5, textAlign: 'center', color: C.text, marginTop: 2 },
  lhEstd:    { fontSize: 8, textAlign: 'center', color: C.text, marginTop: 1 },
  divider:   { height: 1.5, backgroundColor: C.mid, marginHorizontal: ML, marginBottom: 6 },

  // ── Title row ─────────────────────────────────────────────────────────────
  titleRow:    { flexDirection: 'row', alignItems: 'center',
                 backgroundColor: C.bg, borderWidth: 1, borderColor: C.primary,
                 marginHorizontal: ML, paddingHorizontal: 10, paddingVertical: 4,
                 marginBottom: 6 },
  titleLeft:   { width: 120 },
  titleCenter: { flex: 1, alignItems: 'center' },
  titleRight:  { width: 90, alignItems: 'flex-end' },
  receiptNo:   { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.primary },
  titleTxt:    { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.primary },
  dateTxt:     { fontSize: 9, color: C.text },

  // ── "Received from" section ───────────────────────────────────────────────
  rxWrap:    { paddingHorizontal: ML, marginBottom: 5 },
  rxBar:     { height: 1, backgroundColor: C.tint, marginBottom: 4 },
  rxFrom:    { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.sub, marginBottom: 3 },
  rxName:    { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 2 },
  rxFamily:  { fontSize: 8, color: C.sub, marginBottom: 2 },
  rxStudRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 1 },
  rxStud:    { fontSize: 8, color: C.text, marginRight: 12 },

  // ── Payment details ───────────────────────────────────────────────────────
  pmtWrap:  { paddingHorizontal: ML, marginBottom: 6 },
  pmtBar:   { height: 1, backgroundColor: C.tint, marginBottom: 4 },
  pmtRow:   { flexDirection: 'row', marginBottom: 2 },
  pmtLabel: { width: 110, fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.sub },
  pmtVal:   { flex: 1, fontSize: 8, color: C.text },

  // ── 3-card grid ───────────────────────────────────────────────────────────
  cardRow:   { flexDirection: 'row', paddingHorizontal: ML, marginBottom: 6, gap: 6 },
  card:      { flex: 1, borderRadius: 3, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 8 },
  cardLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  cardAmt:   { fontSize: 11, fontFamily: 'Helvetica-Bold' },

  // ── In words ─────────────────────────────────────────────────────────────
  wordsWrap: { marginHorizontal: ML, marginBottom: 8,
               borderLeftWidth: 3, borderLeftColor: C.primary,
               backgroundColor: C.bg, paddingHorizontal: 8, paddingVertical: 5 },
  wordsLbl:  { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.sub, marginBottom: 2 },
  wordsTxt:  { fontSize: 8, color: C.primary, fontFamily: 'Helvetica-Bold' },

  // ── Signatures ────────────────────────────────────────────────────────────
  sigWrap:  { flexDirection: 'row', paddingHorizontal: ML, marginBottom: 4 },
  sigBlock: { flex: 1, alignItems: 'center' },
  sigLine:  { width: '80%', borderBottomWidth: 1, borderBottomColor: C.primary, marginBottom: 3 },
  sigLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.sub },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerBar: { height: 1, backgroundColor: C.tint, marginHorizontal: ML },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between',
               paddingHorizontal: ML, paddingTop: 3 },
  footerTx:  { fontSize: 6.5, color: '#999999' },

  // ── Dashed cut line ───────────────────────────────────────────────────────
  cutWrap:  { flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: ML, paddingVertical: 5 },
  cutLine:  { flex: 1, borderBottomWidth: 1, borderBottomColor: C.dash, borderStyle: 'dashed' },
  cutLabel: { fontSize: 7, color: C.dash, paddingHorizontal: 6 },
});

// ── Single receipt copy ───────────────────────────────────────────────────────
function ReceiptCopy({ family, students, transaction, copyLabel }) {
  const {
    paidAmount = 0,
    previousBalance = 0,
    totalDue = 0,
    totalAdvance = 0,
    paymentMethod = 'Cash',
    chequeNumber,
    transactionReference,
    description = 'Fee Payment',
    billNumber,
    date,
    academicYear,
  } = transaction || {};

  const netBalance = totalDue - totalAdvance;
  const balIsPos   = netBalance > 0;
  const dateStr    = formatBSDateShort(date || new Date());
  const receiptRef = billNumber || '—';

  let methodDetail = paymentMethod;
  if (paymentMethod === 'Cheque' && chequeNumber) methodDetail += ` (Ch# ${chequeNumber})`;
  if ((paymentMethod === 'Bank Transfer' || paymentMethod === 'Online') && transactionReference)
    methodDetail += ` (Ref: ${transactionReference})`;

  const contactName = family?.primaryContact?.name || family?.familyName || '—';

  const balCardStyle  = balIsPos
    ? { backgroundColor: C.balPosBg, borderColor: C.balPosBdr }
    : { backgroundColor: C.balZeroBg, borderColor: C.balZeroBdr };
  const balLabelStyle = { color: balIsPos ? C.balPosTxt : C.balZeroTxt };
  const balAmtStyle   = { color: balIsPos ? C.balPosTxt : C.balZeroTxt };

  return (
    <View style={S.copy}>
      {/* Top accent */}
      <View style={S.accent} />

      {/* Letterhead — logo | centered text | spacer */}
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

      {/* Title row */}
      <View style={S.titleRow}>
        <View style={S.titleLeft}>
          <Text style={S.receiptNo}>R.No: {receiptRef}</Text>
        </View>
        <View style={S.titleCenter}>
          <Text style={S.titleTxt}>PAYMENT RECEIPT</Text>
        </View>
        <View style={S.titleRight}>
          <Text style={S.dateTxt}>Date: {dateStr}</Text>
        </View>
      </View>

      {/* Received from */}
      <View style={S.rxWrap}>
        <View style={S.rxBar} />
        <Text style={S.rxFrom}>Received with thanks from:</Text>
        <Text style={S.rxName}>{contactName}</Text>
        <Text style={S.rxFamily}>
          Family ID: {family?.familyId || '—'}
          {academicYear ? `  ·  Academic Year: ${academicYear}` : ''}
        </Text>
        {students.length > 0 && (
          <View style={S.rxStudRow}>
            {students.map((s, i) => (
              <Text key={i} style={S.rxStud}>
                {s.name}{s.currentClass?.className ? ` (${s.currentClass.className})` : ''}
                {s.rollNumber ? `  R.No: ${s.rollNumber}` : ''}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Payment details */}
      <View style={S.pmtWrap}>
        <View style={S.pmtBar} />
        <View style={S.pmtRow}>
          <Text style={S.pmtLabel}>Particulars:</Text>
          <Text style={S.pmtVal}>{description}</Text>
        </View>
        <View style={S.pmtRow}>
          <Text style={S.pmtLabel}>Payment Mode:</Text>
          <Text style={S.pmtVal}>{methodDetail}</Text>
        </View>
        <View style={S.pmtRow}>
          <Text style={S.pmtLabel}>Previous Balance:</Text>
          <Text style={S.pmtVal}>Rs. {formatRs(previousBalance)}</Text>
        </View>
      </View>

      {/* 3-card grid */}
      <View style={S.cardRow}>
        <View style={[S.card, { backgroundColor: C.paidBg, borderColor: C.paidBdr }]}>
          <Text style={[S.cardLabel, { color: C.paidTxt }]}>AMOUNT PAID</Text>
          <Text style={[S.cardAmt, { color: C.paidTxt }]}>Rs. {formatRs(paidAmount)}</Text>
        </View>
        <View style={[S.card, { backgroundColor: C.dueBg, borderColor: C.dueBdr }]}>
          <Text style={[S.cardLabel, { color: C.dueTxt }]}>TOTAL DUE</Text>
          <Text style={[S.cardAmt, { color: C.dueTxt }]}>Rs. {formatRs(totalDue)}</Text>
        </View>
        <View style={[S.card, balCardStyle]}>
          <Text style={[S.cardLabel, balLabelStyle]}>
            {balIsPos ? 'BALANCE DUE' : 'CLEARED'}
          </Text>
          <Text style={[S.cardAmt, balAmtStyle]}>
            {balIsPos ? `Rs. ${formatRs(netBalance)}` : 'Rs. 0.00'}
          </Text>
        </View>
      </View>

      {/* In words */}
      <View style={S.wordsWrap}>
        <Text style={S.wordsLbl}>Amount in Words:</Text>
        <Text style={S.wordsTxt}>{numberToWords(Math.floor(paidAmount))}</Text>
      </View>

      {/* Signatures */}
      <View style={S.sigWrap}>
        {['Received By', 'Accountant'].map((label) => (
          <View key={label} style={S.sigBlock}>
            <View style={S.sigLine} />
            <Text style={S.sigLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={S.footerBar} />
      <View style={S.footerRow}>
        <Text style={S.footerTx}>This is a computer-generated receipt.</Text>
        <Text style={S.footerTx}>www.shiningstarenglish.school</Text>
      </View>

      {/* Copy label */}
      <View style={S.copyLabel}>
        <Text style={S.copyLabelTx}>{copyLabel}</Text>
      </View>

      {/* Bottom accent */}
      <View style={[S.accent, { marginTop: 3 }]} />
    </View>
  );
}

// ── Dashed cut line ───────────────────────────────────────────────────────────
function CutLine() {
  return (
    <View style={S.cutWrap}>
      <View style={S.cutLine} />
      <Text style={S.cutLabel}>✂ cut here</Text>
      <View style={S.cutLine} />
    </View>
  );
}

/**
 * PaymentReceiptPDF — two copies per page (Student Copy / Office Copy).
 *
 * Props:
 *   family       { familyId, familyName, primaryContact: { name, mobile } }
 *   students     [{ name, currentClass: { className }, rollNumber }]
 *   transaction  Payment FeeTransaction
 */
export default function PaymentReceiptPDF({
  family,
  students = [],
  transaction = {},
}) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <ReceiptCopy family={family} students={students} transaction={transaction} copyLabel="Student Copy" />
        <CutLine />
        <ReceiptCopy family={family} students={students} transaction={transaction} copyLabel="Office Copy" />
      </Page>
    </Document>
  );
}
