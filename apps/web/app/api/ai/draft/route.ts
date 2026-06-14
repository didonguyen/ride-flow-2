import { NextResponse } from "next/server";

import { generateAiDraftUseCase } from "@/src/application/ai/use-case";
import { createMockItineraryDraftProvider } from "@/src/application/ai/mock-provider";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseAiDraftRepository,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "auth_required" },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    tripId?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    pace?: "slow" | "balanced" | "fast";
    preferencePrompt?: string;
  } | null;

  if (!body || !body.tripId || !body.destination || !body.startDate || !body.endDate) {
    return NextResponse.json(
      { error: "ai_draft_invalid" },
      { status: 400 }
    );
  }

  const result = await generateAiDraftUseCase(
    {
      provider: createMockItineraryDraftProvider(),
      repository: createSupabaseAiDraftRepository(rideflowSupabase)
    },
    {
      tripId: body.tripId,
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      pace: body.pace ?? "balanced",
      preferencePrompt: body.preferencePrompt,
      requestedBy: user.id
    }
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "ai_draft_provider_failed" ? 502 : 400 }
    );
  }

  return NextResponse.json(
    {
      runId: result.value.runId,
      summary: result.value.summary,
      draft: result.value.draft
    },
    { status: 200 }
  );
}
