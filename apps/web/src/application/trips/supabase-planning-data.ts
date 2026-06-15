import type {
  PlanningAgendaItem,
  PlanningMapPin,
  PlanningTrip
} from "@/src/application/trips/planning-data";
import {
  pickTripCoverImage,
  pickTripGallery
} from "@/src/application/trips/planning-data";

export type SupabasePlanningTripRow = {
  destination: string;
  end_date: string;
  id: string;
  name: string;
  start_date: string;
};

export type SupabasePlanningDayRow = {
  date: string;
  day_index: number;
  id: string;
  trip_id: string;
};

export type SupabasePlanningTimelineRow = {
  duration_minutes: number;
  id: string;
  notes: string;
  place_lat: number | null;
  place_lng: number | null;
  place_name: string | null;
  start_time: string;
  title: string;
  trip_day_id: string;
  trip_id: string;
};

type MapSupabasePlanningTripInput = {
  days: SupabasePlanningDayRow[];
  timelineItems: SupabasePlanningTimelineRow[];
  trip: SupabasePlanningTripRow;
};

const defaultTimelineImageUrl =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=520&q=85";

export function mapSupabasePlanningTrip({
  days,
  timelineItems,
  trip
}: MapSupabasePlanningTripInput): PlanningTrip {
  const sortedDays = [...days].sort((a, b) => a.day_index - b.day_index);
  const selectedDayId = sortedDays[0]?.id ?? "";
  const selectedTimelineItems = timelineItems
    .filter((item) => item.trip_day_id === selectedDayId)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return {
    id: trip.id,
    name: trip.name,
    destination: trip.destination,
    dateRange: formatDateRange(trip.start_date, trip.end_date),
    selectedDayId,
    days: sortedDays.map((day) => ({
      id: day.id,
      label: `Day ${day.day_index}`,
      date: formatDayLabel(day.date),
      weatherIcon: day.day_index === 1 ? "sun" : "cloud",
      temperature: day.day_index === 1 ? "72°F" : "68°F",
      isSelected: day.id === selectedDayId
    })),
    agenda: selectedTimelineItems.map(mapTimelineItemToAgendaItem),
    mapPins: selectedTimelineItems.map(mapTimelineItemToMapPin),
    coverImageUrl: pickTripCoverImage(trip.id),
    gallery: pickTripGallery(trip.id)
  };
}

function mapTimelineItemToAgendaItem(
  item: SupabasePlanningTimelineRow,
  index: number
): PlanningAgendaItem {
  return {
    id: item.id,
    stop: index + 1,
    time: formatTimeLabel(item.start_time),
    title: item.title,
    description: item.notes,
    category: "food",
    imageUrl: defaultTimelineImageUrl,
    imageAlt: `${item.title} travel stop`
  };
}

function mapTimelineItemToMapPin(
  item: SupabasePlanningTimelineRow,
  index: number
): PlanningMapPin {
  return {
    stop: index + 1,
    label: item.place_name || item.title,
    x: Math.min(82, 42 + index * 14),
    y: Math.min(82, 38 + index * 16)
  };
}

function formatDateRange(startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return `${formatDateWithoutWeekday(start)} - ${formatDateWithoutWeekday(end)}, ${end.getUTCFullYear()}`;
}

function formatDayLabel(date: string) {
  return parseDate(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    weekday: "short"
  });
}

function formatDateWithoutWeekday(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  });
}

function formatTimeLabel(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date(Date.UTC(2026, 0, 1, Number(hours), Number(minutes)));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    timeZone: "UTC"
  });
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}
