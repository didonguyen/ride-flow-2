import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { CreateTripPanel } from "@/components/trips/create-trip-panel";
import { Card, CardContent } from "@/components/ui/card";
import { createTripAction } from "@/src/application/trips/create-trip-action-server";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";

type NewTripPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewTripPage({ searchParams }: NewTripPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/trips/new" as Route);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-10 text-slate-950 sm:px-6">
      <Card className="w-full max-w-2xl border-slate-200 shadow-rideflow-card" data-testid="create-trip-fallback">
        <CardContent className="p-6 sm:p-8">
          <Link
            className="mb-4 inline-block text-sm font-medium text-forest-700 hover:underline"
            data-testid="create-trip-fallback-back"
            href={"/trips" as Route}
          >
            Back to trips
          </Link>
          <CreateTripPanel
            action={createTripAction}
            error={params.error}
            submitLabel="Create trip"
          />
        </CardContent>
      </Card>
    </main>
  );
}
