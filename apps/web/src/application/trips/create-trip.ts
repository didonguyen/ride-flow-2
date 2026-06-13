import { createTripDays, validateTripDateRange } from "@/src/domain/trips";
import { err, type Result } from "@/src/lib/result";
import type {
  CreatedTrip,
  CreateTripError,
  CreateTripInput,
  TripRepository
} from "@/src/application/trips/types";

export async function createTripUseCase(
  repository: TripRepository,
  input: CreateTripInput
): Promise<Result<CreatedTrip, CreateTripError>> {
  const name = input.name.trim();
  const destination = input.destination.trim();

  if (!name) {
    return err("trip_name_required");
  }

  if (!destination) {
    return err("trip_destination_required");
  }

  const dateRange = validateTripDateRange(input.startDate, input.endDate);

  if (!dateRange.ok) {
    return dateRange;
  }

  const trip = await repository.createTripWithDays({
    ownerId: input.ownerId,
    name,
    destination,
    startDate: dateRange.value.startDate,
    endDate: dateRange.value.endDate,
    days: createTripDays(dateRange.value.startDate, dateRange.value.endDate)
  });

  return { ok: true, value: trip };
}
