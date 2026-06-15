import { redirect } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/trips");
    }
  } catch {
    // Missing Supabase env or transient auth failure: treat as anonymous so the
    // landing still renders in local dev.
  }

  return <LandingPage />;
}
