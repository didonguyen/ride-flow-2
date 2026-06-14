import { createTripUseCase } from "@/src/application/trips/create-trip";
import type {
  CreatedTrip,
  CreateTripError,
  TripRepository
} from "@/src/application/trips/types";
import type { Result } from "@/src/lib/result";

type CurrentUser = {
  email?: string | null;
  id: string;
};

type CreateTripFromFormDataInput = {
  formData: FormData;
  getCurrentUser: () => Promise<CurrentUser | null>;
  repository: TripRepository;
};

export type CreateTripActionError = CreateTripError | "auth_required";

export async function createTripFromFormData({
  formData,
  getCurrentUser,
  repository
}: CreateTripFromFormDataInput): Promise<
  Result<CreatedTrip, CreateTripActionError>
> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, error: "auth_required" };
  }

  return createTripUseCase(repository, {
    ownerId: user.id,
    name: getStringField(formData, "name"),
    destination: getStringField(formData, "destination"),
    startDate: getStringField(formData, "startDate"),
    endDate: getStringField(formData, "endDate")
  });
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}
