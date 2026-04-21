import { pdf } from '@react-pdf/renderer';

/**
 * Render a @react-pdf/renderer element to a Blob, open it in a new tab.
 * The tab shows the browser's native PDF viewer where the user can print or download.
 *
 * @param {React.ReactElement} element  e.g. <DemandBillPDF ... />
 */
export async function openPDF(element) {
  const blob = await pdf(element).toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Revoke after a generous delay so the new tab has time to load
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

/**
 * Same as openPDF but triggers a file download with the given filename.
 */
export async function downloadPDF(element, filename = 'document.pdf') {
  const blob = await pdf(element).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Format a number as comma-separated Rupees with 2 decimals (Indian style).
 * e.g. 12500 → "12,500.00"
 */
export function formatRs(amount) {
  const num = Number(amount) || 0;
  const rupees = Math.floor(num);
  const paisa = Math.round((num - rupees) * 100);
  return `${rupees.toLocaleString('en-IN')}.${String(paisa).padStart(2, '0')}`;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

function convertLT1000(n) {
  if (n === 0) return '';
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLT1000(n % 100) : '');
}

/**
 * Convert an integer amount to English words.
 * e.g. 12500 → "Twelve Thousand Five Hundred Rupees Only"
 */
export function numberToWords(num) {
  const n = Math.floor(Number(num) || 0);
  if (n === 0) return 'Zero Rupees Only';
  const lakh = Math.floor(n / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  let result = '';
  if (lakh) result += convertLT1000(lakh) + ' Lakh ';
  if (thousand) result += convertLT1000(thousand) + ' Thousand ';
  if (rest) result += convertLT1000(rest);
  return result.trim() + ' Rupees Only';
}
