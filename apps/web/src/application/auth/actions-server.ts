"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";

import { normalizeAuthRedirect } from "@/src/application/auth/redirect";

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function buildErrorRedirect(path: "/sign-in" | "/sign-up", message: string) {
  const params = new URLSearchParams({ error: message });
  return `${path}?${params.toString()}`;
}

export async function signInAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");
  const next = normalizeAuthRedirect(getStringField(formData, "next") || null);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(buildErrorRedirect("/sign-in", error.message) as Route);
  }

  redirect(next as Route);
}

export async function signUpAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");
  const next = normalizeAuthRedirect(getStringField(formData, "next") || null);

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    redirect(buildErrorRedirect("/sign-up", error.message) as Route);
  }

  redirect(next as Route);
}
