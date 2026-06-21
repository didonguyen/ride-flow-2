"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseTimelineRepository,
  createSupabaseTripDayRepository,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export async function addPlanningDayAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const repository = createSupabaseTripDayRepository(
    supabase as unknown as RideFlowSupabaseClient
  );
  const tripId = getStringField(formData, "tripId");
  const date = getStringField(formData, "date");
  const dayIndex = Number(getStringField(formData, "dayIndex"));

  if (!tripId || !date || !Number.isFinite(dayIndex) || dayIndex < 1) {
    return;
  }

  await repository.addTripDay({ tripId, date, dayIndex });
  await repository.updateTripEndDate({ tripId, endDate: date });
  revalidatePath(`/trips/${tripId}`);
}

export async function addPlanningStopAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const repository = createSupabaseTimelineRepository(
    supabase as unknown as RideFlowSupabaseClient
  );
  const tripId = getStringField(formData, "tripId");
  const tripDayId = getStringField(formData, "tripDayId");

  if (!tripId || !tripDayId) {
    return;
  }

  await repository.addItem({
    tripId,
    tripDayId,
    title: getStringField(formData, "title") || "New stop",
    startTime: getStringField(formData, "startTime") || "09:00",
    durationMinutes: Number(getStringField(formData, "durationMinutes")) || 60,
    notes: getStringField(formData, "notes")
  });
  revalidatePath(`/trips/${tripId}`);
}

export async function updatePlanningStopAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const repository = createSupabaseTimelineRepository(
    supabase as unknown as RideFlowSupabaseClient
  );
  const tripId = getStringField(formData, "tripId");
  const itemId = getStringField(formData, "itemId");

  if (!tripId || !itemId) {
    return;
  }

  await repository.updateItem({
    itemId,
    notes: getStringField(formData, "notes"),
    startTime: to24HourTime(getStringField(formData, "startTime")) || undefined,
    title: getStringField(formData, "title") || undefined
  });
  revalidatePath(`/trips/${tripId}`);
}

export async function deletePlanningStopAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const repository = createSupabaseTimelineRepository(
    supabase as unknown as RideFlowSupabaseClient
  );
  const tripId = getStringField(formData, "tripId");
  const itemId = getStringField(formData, "itemId");

  if (!tripId || !itemId) {
    return;
  }

  await repository.deleteItem({ itemId });
  revalidatePath(`/trips/${tripId}`);
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function to24HourTime(value: string) {
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return value;
  }

  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value);
  if (!match) {
    return "";
  }

  const hours = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3].toUpperCase();
  let hour24 = hours % 12;
  if (meridiem === "PM") {
    hour24 += 12;
  }

  return `${hour24.toString().padStart(2, "0")}:${minutes}`;
}
