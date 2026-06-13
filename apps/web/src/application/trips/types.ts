import type { TripDayDraft } from "@/src/domain/trips";

export type CreateTripInput = {
  ownerId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
};

export type PersistTripWithDaysInput = CreateTripInput & {
  days: TripDayDraft[];
};

export type CreatedTripDay = {
  id: string;
  tripId: string;
  date: string;
  dayIndex: number;
};

export type CreatedTrip = CreateTripInput & {
  id: string;
  days: CreatedTripDay[];
};

export type CreateTripError =
  | "trip_name_required"
  | "trip_destination_required"
  | "trip_date_invalid"
  | "trip_end_before_start";

export type TripRepository = {
  createTripWithDays(input: PersistTripWithDaysInput): Promise<CreatedTrip>;
};
