import type { DashboardTrip } from "@/src/application/trips/dashboard-data";

export type SupabaseDashboardTripRow = {
  created_at: string;
  destination: string;
  end_date: string;
  id: string;
  name: string;
  start_date: string;
};

const defaultImageUrls = [
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85"
];

function pickImageUrl(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return defaultImageUrls[hash % defaultImageUrls.length];
}

export function mapSupabaseDashboardTrips(
  rows: SupabaseDashboardTripRow[]
): DashboardTrip[] {
  return rows.map((row) => {
    const start = parseDate(row.start_date);
    const end = parseDate(row.end_date);
    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
    const startLabel = formatMonthDay(start);
    const endLabel = formatMonthDay(end);
    const yearLabel = end.getUTCFullYear();

    return {
      id: row.id,
      name: row.name,
      destination: row.destination,
      region: row.destination,
      dateRange: sameYear
        ? `${startLabel} - ${endLabel}, ${yearLabel}`
        : `${startLabel}, ${start.getUTCFullYear()} - ${endLabel}, ${yearLabel}`,
      imageUrl: pickImageUrl(row.id),
      imageAlt: `${row.destination} travel destination`
    } satisfies DashboardTrip;
  });
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatMonthDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  });
}
