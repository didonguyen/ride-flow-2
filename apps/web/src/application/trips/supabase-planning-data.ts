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
  cover_image_url?: string | null;
  destination: string;
  end_date: string;
  id: string;
  name: string;
  start_date: string;
  transport?: string | null;
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
  place_address?: string | null;
  place_external_url?: string | null;
  place_lat: number | null;
  place_lng: number | null;
  place_name: string | null;
  place_source?: "seed" | "osm" | "manual" | "google" | null;
  place_source_id?: string | null;
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
  const sortedTimelineItems = [...timelineItems].sort((a, b) => {
    const dayA = sortedDays.find((day) => day.id === a.trip_day_id)?.day_index ?? 0;
    const dayB = sortedDays.find((day) => day.id === b.trip_day_id)?.day_index ?? 0;
    return dayA - dayB || a.start_time.localeCompare(b.start_time);
  });

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
    agenda: sortedTimelineItems.map((item, index) =>
      mapTimelineItemToAgendaItem(item, index)
    ),
    mapPins: sortedTimelineItems.map(mapTimelineItemToMapPin),
    coverImageUrl: trip.cover_image_url || pickTripCoverImage(trip.id),
    transport: trip.transport || "Motorcycle",
    gallery: pickTripGallery(trip.id)
  };
}

function mapTimelineItemToAgendaItem(
  item: SupabasePlanningTimelineRow,
  index: number
): PlanningAgendaItem {
  return {
    id: item.id,
    dayId: item.trip_day_id,
    stop: index + 1,
    time: formatTimeLabel(item.start_time),
    title: item.title,
    description: item.notes,
    category: "food",
    imageUrl: defaultTimelineImageUrl,
    imageAlt: `${item.title} travel stop`,
    place: item.place_name
      ? {
          id: item.place_source_id ?? item.place_name,
          source: item.place_source ?? "manual",
          name: item.place_name,
          address: item.place_address ?? undefined,
          lat: item.place_lat ?? undefined,
          lng: item.place_lng ?? undefined,
          externalUrl: item.place_external_url ?? undefined
        }
      : undefined
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
