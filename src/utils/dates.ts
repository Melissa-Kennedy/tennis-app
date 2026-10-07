const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** Today's local date as YYYY-MM-DD, the format used by <input type="date"> */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** "2026-06-12" -> { day: "12", month: "JUN", year: "2026" } */
export function stampDateParts(iso: string) {
  const date = parseIsoDate(iso);
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTHS[date.getMonth()],
    year: String(date.getFullYear()),
  };
}

export function formatLongDate(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}
