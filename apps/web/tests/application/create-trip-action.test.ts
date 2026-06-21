import { describe, expect, it, vi } from "vitest";

import { createTripFromFormData } from "@/src/application/trips/create-trip-action";

function buildFormData(values: Record<string, string>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("createTripFromFormData", () => {
  it("persists a trip for the authenticated user with transport", async () => {
    const repository = {
      createTripWithDays: vi.fn(async (input) => ({
        id: "trip-1",
        ownerId: "user-1",
        name: "Da Nang Trip",
        destination: "Da Nang",
        startDate: "2026-07-01",
        endDate: "2026-07-02",
        transport: input.transport ?? "Motorcycle",
        days: []
      }))
    };

    const result = await createTripFromFormData({
      formData: buildFormData({
        name: " Da Nang Trip ",
        destination: " Da Nang ",
        startDate: "2026-07-01",
        endDate: "2026-07-02",
        transport: " Van "
      }),
      getCurrentUser: async () => ({
        id: "user-1",
        email: "owner@example.com"
      }),
      repository
    });

    expect(repository.createTripWithDays).toHaveBeenCalledWith({
      ownerId: "user-1",
      ownerEmail: "owner@example.com",
      name: "Da Nang Trip",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-02",
      transport: "Van",
      days: [
        { date: "2026-07-01", dayIndex: 1 },
        { date: "2026-07-02", dayIndex: 2 }
      ]
    });
    expect(result).toMatchObject({
      ok: true,
      value: {
        id: "trip-1",
        transport: "Van"
      }
    });
  });

  it("requires an authenticated user before calling the repository", async () => {
    const repository = {
      createTripWithDays: vi.fn()
    };

    const result = await createTripFromFormData({
      formData: buildFormData({
        name: "Da Nang Trip",
        destination: "Da Nang",
        startDate: "2026-07-01",
        endDate: "2026-07-02"
      }),
      getCurrentUser: async () => null,
      repository
    });

    expect(repository.createTripWithDays).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false, error: "auth_required" });
  });
});
