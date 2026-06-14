"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { inviteMemberUseCase } from "@/src/application/members/invite-member";
import { updateMemberRoleUseCase } from "@/src/application/members/update-member-role";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseMemberRepository,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";
import type { TripRole } from "@/src/domain/permissions";
import type { User } from "@supabase/supabase-js";

function redirectWithError(tripId: string, code: string): never {
  redirect(`/trips/${tripId}?members_error=${code}#members`);
}

async function requireViewer(tripId: string): Promise<{ supabase: RideFlowSupabaseClient; user: User } | never> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithError(tripId, "auth_required");
  }

  return {
    supabase: supabase as unknown as RideFlowSupabaseClient,
    user: user as User
  };
}

export async function inviteMemberAction(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "") as TripRole;

  if (!tripId) {
    return;
  }

  const { supabase, user } = await requireViewer(tripId);
  const repository = createSupabaseMemberRepository(supabase);

  const viewerRole = await repository.getViewerRole(tripId, user.id);
  if (!viewerRole) {
    redirectWithError(tripId, "members_forbidden");
  }

  const result = await inviteMemberUseCase(repository, {
    actorRole: viewerRole,
    tripId,
    email,
    role
  });

  if (!result.ok) {
    redirectWithError(tripId, result.error);
  }

  revalidatePath(`/trips/${tripId}`);
}

export async function updateMemberRoleAction(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const role = String(formData.get("role") ?? "") as TripRole;

  if (!tripId || !memberId) {
    return;
  }

  const { supabase, user } = await requireViewer(tripId);
  const repository = createSupabaseMemberRepository(supabase);

  const viewerRole = await repository.getViewerRole(tripId, user.id);
  if (!viewerRole) {
    redirectWithError(tripId, "members_forbidden");
  }

  const result = await updateMemberRoleUseCase(repository, {
    actorRole: viewerRole,
    memberId,
    role
  });

  if (!result.ok) {
    redirectWithError(tripId, result.error);
  }

  revalidatePath(`/trips/${tripId}`);
}
