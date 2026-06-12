import { describe, expect, it, vi } from "vitest";
import { addTimelineItemUseCase } from "@/src/application/timeline/add-item";
import { deleteTimelineItemUseCase } from "@/src/application/timeline/delete-item";
import { moveTimelineItemUseCase } from "@/src/application/timeline/move-item";
import type { TimelineRepository } from "@/src/application/timeline/types";

describe("timeline use cases", () => {
  it("allows a planner to add a valid item with sanitized values", async () => {
    const repository: TimelineRepository = {
      addItem: vi.fn(async () => ({ id: "item-1" })),
      moveItem: vi.fn(),
      deleteItem: vi.fn()
    };

    const result = await addTimelineItemUseCase(repository, {
      actorRole: "planner",
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "  Dinner  ",
      startTime: "19:00",
      durationMinutes: 90,
      notes: "  Try the seafood  ",
      place: {
        id: "seed:restaurant",
        source: "seed",
        name: "Sea House"
      }
    });

    expect(repository.addItem).toHaveBeenCalledWith({
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "Dinner",
      startTime: "19:00",
      durationMinutes: 90,
      notes: "Try the seafood",
      place: {
        id: "seed:restaurant",
        source: "seed",
        name: "Sea House"
      }
    });
    expect(result).toEqual({ ok: true, value: { id: "item-1" } });
  });

  it("blocks a viewer from adding before calling the repository", async () => {
    const repository: TimelineRepository = {
      addItem: vi.fn(),
      moveItem: vi.fn(),
      deleteItem: vi.fn()
    };

    const result = await addTimelineItemUseCase(repository, {
      actorRole: "viewer",
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "Dinner",
      startTime: "19:00",
      durationMinutes: 90,
      notes: ""
    });

    expect(result).toEqual({
      ok: false,
      error: "timeline_mutation_forbidden"
    });
    expect(repository.addItem).not.toHaveBeenCalled();
  });

  it("rejects invalid add input before calling the repository", async () => {
    const repository: TimelineRepository = {
      addItem: vi.fn(),
      moveItem: vi.fn(),
      deleteItem: vi.fn()
    };

    const result = await addTimelineItemUseCase(repository, {
      actorRole: "owner",
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "  ",
      startTime: "19:00",
      durationMinutes: 90,
      notes: ""
    });

    expect(result).toEqual({
      ok: false,
      error: "timeline_title_required"
    });
    expect(repository.addItem).not.toHaveBeenCalled();
  });

  it("snaps moved items to the nearest timeline interval", async () => {
    const repository: TimelineRepository = {
      addItem: vi.fn(),
      moveItem: vi.fn(async (input) => ({
        id: input.itemId,
        startTime: input.startTime
      })),
      deleteItem: vi.fn()
    };

    const result = await moveTimelineItemUseCase(repository, {
      actorRole: "planner",
      itemId: "item-1",
      minutesSinceMidnight: 548
    });

    expect(repository.moveItem).toHaveBeenCalledWith({
      itemId: "item-1",
      startTime: "09:15"
    });
    expect(result).toEqual({
      ok: true,
      value: { id: "item-1", startTime: "09:15" }
    });
  });

  it("blocks a viewer from deleting before calling the repository", async () => {
    const repository: TimelineRepository = {
      addItem: vi.fn(),
      moveItem: vi.fn(),
      deleteItem: vi.fn()
    };

    const result = await deleteTimelineItemUseCase(repository, {
      actorRole: "viewer",
      itemId: "item-1"
    });

    expect(result).toEqual({
      ok: false,
      error: "timeline_mutation_forbidden"
    });
    expect(repository.deleteItem).not.toHaveBeenCalled();
  });
});
