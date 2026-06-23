import type { PlanningAgendaItem, PlanningTrip } from "@/src/application/trips/planning-data";
import type { Stop, StopOption, StopOptionSource } from "@/src/domain/stop-options";
import type {
  StopPlanningTrip
} from "@/components/planning/stop-planning-workspace";

const PLACE_SOURCE_TO_OPTION_SOURCE: Record<
  "seed" | "osm" | "manual" | "google" | "google_places",
  StopOptionSource
> = {
  seed: "manual",
  osm: "manual",
  manual: "manual",
  google: "google_places",
  google_places: "google_places"
};

function categoryToPlaceLabel(category: PlanningAgendaItem["category"]) {
  switch (category) {
    case "flight":
      return "Travel";
    case "hotel":
      return "Stay";
    case "food":
      return "Food";
    case "fuel":
      return "Fuel";
    case "activity":
      return "Activity";
    default:
      return "Stop";
  }
}

function parseRating(value?: string): number | null {
  if (!value) return null;
  const match = /(\d+(?:\.\d+)?)/.exec(value);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? Math.min(5, Math.max(0, parsed)) : null;
}

export function convertLegacyTripToStops(trip: PlanningTrip): StopPlanningTrip {
  const stops: Stop[] = trip.agenda.map((item, index) => {
    const options: StopOption[] = [];
    const place = item.place;

    if (place) {
      options.push({
        id: `${item.id}-opt`,
        stopId: item.id,
        tripId: trip.id,
        name: place.name,
        address: place.address,
        description: item.description,
        imageUrl: place.imageUrl ?? item.imageUrl,
        rating: parseRating(item.rating),
        distanceText: undefined,
        durationText: undefined,
        googlePlaceId: place.source === "google" ? place.id : undefined,
        googleMapsUrl: place.externalUrl,
        lat: place.lat ?? null,
        lng: place.lng ?? null,
        source: PLACE_SOURCE_TO_OPTION_SOURCE[place.source],
        status: item.status === "confirmed" || item.status === "ready" ? "pinned" : "candidate",
        sortOrder: 0
      });
    }

    return {
      id: item.id,
      tripId: trip.id,
      dayId: item.dayId ?? trip.days[0]?.id ?? "day-1",
      title: item.title,
      time: item.time,
      description: item.description,
      note: "",
      locationName: place?.name ?? categoryToPlaceLabel(item.category),
      address: place?.address,
      lat: place?.lat ?? null,
      lng: place?.lng ?? null,
      status: options.length > 0 ? "pinned" : "action_needed",
      pinnedOptionId: options.length > 0 ? options[0]?.id ?? null : null,
      sortOrder: index,
      options
    };
  });

  return {
    id: trip.id,
    name: trip.name,
    destination: trip.destination ?? trip.name,
    selectedDayId: trip.selectedDayId,
    days: trip.days.map((day) => ({
      id: day.id,
      label: day.label,
      date: day.date,
      isSelected: day.id === trip.selectedDayId,
      stops: stops.filter((stop) => stop.dayId === day.id)
    }))
  };
}