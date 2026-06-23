import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  addManualOptionUseCase,
  addStopUseCase,
  deleteStopUseCase,
  generateStopOptionsUseCase,
  pinStopOptionUseCase,
  removeStopOptionUseCase,
  reorderStopsUseCase,
  searchGooglePlacesForStopUseCase,
  unpinStopOptionUseCase,
  updateStopUseCase
} from "@/src/application/stop-options/use-cases";
import type {
  StopOptionAiGenerator,
  StopOptionProvider,
  StopOptionRepository,
  StopRepository
} from "@/src/application/stop-options/types";
import type { StopOption } from "@/src/domain/stop-options";

function makeOption(overrides: Partial<StopOption>): StopOption {
  return {
    id: overrides.id ?? "opt",
    stopId: overrides.stopId ?? "stop-1",
    tripId: overrides.tripId ?? "trip-1",
    name: overrides.name ?? "Forest Cafe",
    source: overrides.source ?? "manual",
    status: overrides.status ?? "candidate",
    sortOrder: overrides.sortOrder ?? 0,
    rating: overrides.rating,
    address: overrides.address,
    description: overrides.description,
    imageUrl: overrides.imageUrl,
    distanceText: overrides.distanceText,
    durationText: overrides.durationText,
    googlePlaceId: overrides.googlePlaceId,
    googleMapsUrl: overrides.googleMapsUrl,
    lat: overrides.lat,
    lng: overrides.lng
  };
}

function makeStopRepository(): StopRepository {
  return {
    addStop: vi.fn(async () => ({ id: "stop-1" })),
    updateStop: vi.fn(async () => ({ id: "stop-1" })),
    deleteStop: vi.fn(async () => ({ id: "stop-1" })),
    reorderStops: vi.fn(async () => ({ stopIds: ["stop-1"] }))
  };
}

function makeStopOptionRepository(options: StopOption[]): {
  repository: StopOptionRepository;
  state: { options: StopOption[]; pinnedStopId: string | null };
} {
  const state = {
    options: [...options],
    pinnedStopId: options.find((o) => o.status === "pinned")?.id ?? null
  };

  const repository: StopOptionRepository = {
    addOption: vi.fn(async (input) => {
      const id = `opt-${state.options.length + 1}`;
      state.options.push({
        id,
        stopId: input.stopId,
        tripId: input.tripId,
        name: input.draft.name,
        source: input.source,
        status: input.status,
        address: input.draft.address,
        description: input.draft.description,
        imageUrl: input.draft.imageUrl,
        rating: input.draft.rating ?? null,
        distanceText: input.draft.distanceText,
        durationText: input.draft.durationText,
        googlePlaceId: input.draft.googlePlaceId,
        googleMapsUrl: input.draft.googleMapsUrl,
        lat: input.draft.lat ?? null,
        lng: input.draft.lng ?? null,
        sortOrder: state.options.length
      });
      return { id };
    }),
    updateOptionStatus: vi.fn(async (input) => {
      const option = state.options.find(
        (o) => o.id === input.optionId && o.stopId === input.stopId
      );
      if (option) {
        option.status = input.status;
      }
      return { id: input.optionId };
    }),
    updateStopPinned: vi.fn(async (input) => {
      state.pinnedStopId = input.pinnedOptionId;
      return { id: input.stopId };
    }),
    listOptionsForStop: vi.fn(async (input) =>
      state.options.filter((o) => o.stopId === input.stopId)
    ),
    listOptionsForStops: vi.fn(async (input) =>
      state.options.filter((o) => input.stopIds.includes(o.stopId))
    ),
    removeOption: vi.fn(async (input) => {
      const option = state.options.find(
        (o) => o.id === input.optionId && o.stopId === input.stopId
      );
      if (option) option.status = "removed";
      return { id: input.optionId };
    })
  };

  return { repository, state };
}

describe("addStopUseCase", () => {
  it("forbids members and viewers", async () => {
    const repo = makeStopRepository();
    const result = await addStopUseCase(repo, {
      actorRole: "member",
      tripId: "trip-1",
      dayId: "day-1",
      draft: { title: "Lunch" }
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("stop_mutation_forbidden");
  });

  it("creates the stop when the actor is a planner", async () => {
    const repo = makeStopRepository();
    const result = await addStopUseCase(repo, {
      actorRole: "planner",
      tripId: "trip-1",
      dayId: "day-1",
      draft: { title: "Lunch", time: "12:30" }
    });
    expect(result.ok).toBe(true);
    expect(repo.addStop).toHaveBeenCalled();
  });
});

describe("updateStopUseCase / deleteStopUseCase", () => {
  it("rejects mutations from viewers", async () => {
    const repo = makeStopRepository();
    const update = await updateStopUseCase(repo, {
      actorRole: "viewer",
      stopId: "stop-1",
      patch: { title: "New" }
    });
    const remove = await deleteStopUseCase(repo, {
      actorRole: "viewer",
      stopId: "stop-1"
    });
    expect(update.ok).toBe(false);
    expect(remove.ok).toBe(false);
  });

  it("applies the update for owners", async () => {
    const repo = makeStopRepository();
    const update = await updateStopUseCase(repo, {
      actorRole: "owner",
      stopId: "stop-1",
      patch: { title: "New title" }
    });
    expect(update.ok).toBe(true);
    expect(repo.updateStop).toHaveBeenCalledWith({
      stopId: "stop-1",
      patch: { title: "New title" }
    });
  });
});

describe("reorderStopsUseCase", () => {
  it("persists the new order for planners", async () => {
    const repo = makeStopRepository();
    const result = await reorderStopsUseCase(repo, {
      actorRole: "planner",
      moves: [
        { stopId: "stop-1", dayId: "day-1", sortOrder: 2 },
        { stopId: "stop-2", dayId: "day-2", sortOrder: 0 }
      ]
    });
    expect(result.ok).toBe(true);
    expect(repo.reorderStops).toHaveBeenCalled();
  });

  it("rejects reorder from viewers", async () => {
    const repo = makeStopRepository();
    const result = await reorderStopsUseCase(repo, {
      actorRole: "viewer",
      moves: []
    });
    expect(result.ok).toBe(false);
  });
});

describe("pinStopOptionUseCase", () => {
  let initial: StopOption[];

  beforeEach(() => {
    initial = [
      makeOption({ id: "a", status: "candidate" }),
      makeOption({ id: "b", status: "candidate" }),
      makeOption({ id: "c", status: "candidate" })
    ];
  });

  it("rejects viewers", async () => {
    const { repository } = makeStopOptionRepository(initial);
    const result = await pinStopOptionUseCase(repository, {
      actorRole: "viewer",
      stopId: "stop-1",
      optionId: "b"
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown options", async () => {
    const { repository } = makeStopOptionRepository(initial);
    const result = await pinStopOptionUseCase(repository, {
      actorRole: "owner",
      stopId: "stop-1",
      optionId: "missing"
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("option_not_found");
  });

  it("pins the option and demotes the others to backup", async () => {
    const { repository, state } = makeStopOptionRepository(initial);
    const result = await pinStopOptionUseCase(repository, {
      actorRole: "planner",
      stopId: "stop-1",
      optionId: "b"
    });
    expect(result.ok).toBe(true);
    expect(state.options.find((o) => o.id === "b")?.status).toBe("pinned");
    expect(state.options.find((o) => o.id === "a")?.status).toBe("backup");
    expect(state.options.find((o) => o.id === "c")?.status).toBe("backup");
    expect(state.pinnedStopId).toBe("b");
  });
});

describe("unpinStopOptionUseCase", () => {
  it("clears the pinned option and resets stop status", async () => {
    const initial: StopOption[] = [
      makeOption({ id: "a", status: "pinned" }),
      makeOption({ id: "b", status: "backup" })
    ];
    const { repository, state } = makeStopOptionRepository(initial);
    const result = await unpinStopOptionUseCase(repository, {
      actorRole: "owner",
      stopId: "stop-1"
    });
    expect(result.ok).toBe(true);
    expect(state.options.find((o) => o.id === "a")?.status).toBe("candidate");
    expect(state.pinnedStopId).toBeNull();
  });
});

describe("addManualOptionUseCase", () => {
  it("adds a manual option candidate", async () => {
    const { repository } = makeStopOptionRepository([]);
    const result = await addManualOptionUseCase(repository, {
      actorRole: "planner",
      stopId: "stop-1",
      tripId: "trip-1",
      draft: { name: "Forest Cafe", source: "manual", rating: 4.5 }
    });
    expect(result.ok).toBe(true);
    expect(repository.addOption).toHaveBeenCalled();
  });
});

describe("generateStopOptionsUseCase", () => {
  it("falls back to the AI generator when no drafts are supplied", async () => {
    const { repository } = makeStopOptionRepository([]);
    const generator: StopOptionAiGenerator = {
      generateOptions: vi.fn(
        async (): Promise<Array<{ name: string; source: "ai" }>> => [
          { name: "Forest Cafe", source: "ai" },
          { name: "River View Bistro", source: "ai" }
        ]
      )
    };
    const result = await generateStopOptionsUseCase(
      repository,
      generator,
      {
        actorRole: "planner",
        stopId: "stop-1",
        tripId: "trip-1",
        stopTitle: "Lunch",
        destination: "Nam Cát Tiên",
        results: []
      }
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.added).toBe(2);
  });

  it("uses provided drafts and caps at 5", async () => {
    const { repository } = makeStopOptionRepository([]);
    const result = await generateStopOptionsUseCase(
      repository,
      { generateOptions: vi.fn() },
      {
        actorRole: "planner",
        stopId: "stop-1",
        tripId: "trip-1",
        stopTitle: "Lunch",
        destination: "Nam Cát Tiên",
        results: Array.from({ length: 8 }).map((_, i) => ({
          name: `Cafe ${i + 1}`,
          source: "ai" as const
        }))
      }
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.added).toBe(5);
  });
});

describe("searchGooglePlacesForStopUseCase", () => {
  it("returns the result count and adds the options", async () => {
    const { repository } = makeStopOptionRepository([]);
    const provider: StopOptionProvider = {
      searchGooglePlaces: vi.fn(async () => [])
    };
    const result = await searchGooglePlacesForStopUseCase(
      repository,
      provider,
      {
        actorRole: "planner",
        stopId: "stop-1",
        tripId: "trip-1",
        query: "coffee near park",
        results: [
          { name: "Forest Cafe", source: "google_places", rating: 4.5 },
          { name: "River View", source: "google_places", rating: 4.2 }
        ]
      }
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.added).toBe(2);
  });
});

describe("removeStopOptionUseCase", () => {
  it("moves the pinned option to candidate and resets stop", async () => {
    const initial: StopOption[] = [
      makeOption({ id: "a", status: "pinned" }),
      makeOption({ id: "b", status: "backup" })
    ];
    const { repository, state } = makeStopOptionRepository(initial);
    const result = await removeStopOptionUseCase(repository, {
      actorRole: "planner",
      stopId: "stop-1",
      optionId: "a"
    });
    expect(result.ok).toBe(true);
    expect(state.options.find((o) => o.id === "a")?.status).toBe("candidate");
    expect(state.pinnedStopId).toBeNull();
  });

  it("soft-removes a backup option", async () => {
    const initial: StopOption[] = [
      makeOption({ id: "a", status: "backup" })
    ];
    const { repository, state } = makeStopOptionRepository(initial);
    const result = await removeStopOptionUseCase(repository, {
      actorRole: "planner",
      stopId: "stop-1",
      optionId: "a"
    });
    expect(result.ok).toBe(true);
    expect(state.options.find((o) => o.id === "a")?.status).toBe("removed");
  });
});