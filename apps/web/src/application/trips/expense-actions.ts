"use server";

import { revalidatePath } from "next/cache";

import { splitExpenseEqually } from "@/src/domain/expenses";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseExpenseRepository,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export async function addExpenseAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const tripId = getStringField(formData, "tripId");
  const paidByMemberId = getStringField(formData, "paidByMemberId");
  const participantIds = getStringList(formData, "participantIds");
  const amount = Number(getStringField(formData, "amount"));
  if (!tripId || !paidByMemberId || !Number.isFinite(amount) || participantIds.length === 0) {
    return;
  }

  await createSupabaseExpenseRepository(
    supabase as unknown as RideFlowSupabaseClient
  ).createExpense({
    tripId,
    createdBy: user.id,
    title: getStringField(formData, "title") || "Expense",
    amount,
    currency: normalizeCurrency(getStringField(formData, "currency")),
    category: getStringField(formData, "category") || "other",
    paidByMemberId,
    date: getStringField(formData, "date") || new Date().toISOString().slice(0, 10),
    notes: getStringField(formData, "notes"),
    participants: splitExpenseEqually({ amount, participantIds })
  });
  revalidatePath(`/trips/${tripId}/expenses`);
}

export async function updateExpenseAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const tripId = getStringField(formData, "tripId");
  const expenseId = getStringField(formData, "expenseId");
  const paidByMemberId = getStringField(formData, "paidByMemberId");
  const participantIds = getStringList(formData, "participantIds");
  const amount = Number(getStringField(formData, "amount"));
  if (
    !tripId ||
    !expenseId ||
    !paidByMemberId ||
    !Number.isFinite(amount) ||
    participantIds.length === 0
  ) {
    return;
  }

  await createSupabaseExpenseRepository(
    supabase as unknown as RideFlowSupabaseClient
  ).updateExpense({
    tripId,
    expenseId,
    title: getStringField(formData, "title") || "Expense",
    amount,
    currency: normalizeCurrency(getStringField(formData, "currency")),
    category: getStringField(formData, "category") || "other",
    paidByMemberId,
    date: getStringField(formData, "date") || new Date().toISOString().slice(0, 10),
    notes: getStringField(formData, "notes"),
    participants: splitExpenseEqually({ amount, participantIds })
  });
  revalidatePath(`/trips/${tripId}/expenses`);
}

export async function deleteExpenseAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const tripId = getStringField(formData, "tripId");
  const expenseId = getStringField(formData, "expenseId");
  if (!tripId || !expenseId) return;

  await createSupabaseExpenseRepository(
    supabase as unknown as RideFlowSupabaseClient
  ).deleteExpense({ expenseId });
  revalidatePath(`/trips/${tripId}/expenses`);
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCurrency(value: string) {
  const normalized = value.toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : "VND";
}

function getStringList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
}