export type ExhibitionState = 'upcoming' | 'current' | 'archived' | 'undated';

export function classifyExhibition(
  exhibition: { start_date?: string; end_date?: string },
  today = new Date(),
): ExhibitionState {
  const start = exhibition.start_date?.slice(0, 10);
  const end = exhibition.end_date?.slice(0, 10);
  if (!start || !end) return 'undated';
  const currentDay = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit' }).format(today);
  if (currentDay < start) return 'upcoming';
  if (currentDay > end) return 'archived';
  return 'current';
}

export function formatDateRange(start?: string, end?: string): string | null {
  if (!start || !end) return null;
  const format = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Stockholm' });
  return `${format.format(new Date(`${start.slice(0, 10)}T12:00:00Z`))} – ${format.format(new Date(`${end.slice(0, 10)}T12:00:00Z`))}`;
}
