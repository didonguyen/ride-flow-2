import { describe, expect, it } from "vitest";

import {
  applyPin,
  applyUnpin,
  getActiveOption,
  getBackupOptions,
  getCandidateOptions,
  isStopOptionSource,
  isStopOptionStatus,
  isStopStatus,
  sortBackupOptions,
  validateStopDraft,
  validateStopOptionDraft,
  type Stop,
  type StopOption
} from "@/src/domain/stop-options";

const baseStopOption = (overrides: Partial<StopOption> = {}): StopOption => ({
  id: "opt-1",
  stopId: "stop-1",
  tripId: "trip-1",
  name: "Forest Cafe",
  source: "manual",
  status: "candidate",
  sortOrder: 0,
  ...overrides
});

describe("validateStopDraft", () => {
  it("rejects an empty title", () => {
    const result = validateStopDraft({ title: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("stop_title_required");
    }
  });

  it("rejects a malformed time", () => {
    const result = validateStopDraft({ title: "Lunch", time: "25:99" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("stop_time_invalid");
    }
  });

  it("accepts a valid draft", () => {
    const result = validateStopDraft({
      title: "Lunch near the park",
      time: "12:30",
      description: "Group lunch",
      address: "Highway 20"
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title).toBe("Lunch near the park");
      expect(result.value.time).toBe("12:30");
      expect(result.value.description).toBe("Group lunch");
      expect(result.value.address).toBe("Highway 20");
    }
  });
});

describe("validateStopOptionDraft", () => {
  it("rejects an empty name", () => {
    const result = validateStopOptionDraft({ name: "", source: "manual" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("option_name_required");
    }
  });

  it("rejects an out-of-range rating", () => {
    const result = validateStopOptionDraft({
      name: "Forest Cafe",
      source: "manual",
      rating: 6
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("option_rating_invalid");
    }
  });

  it("accepts a valid option draft", () => {
    const result = validateStopOptionDraft({
      name: "Forest Cafe",
      source: "google_places",
      rating: 4.5,
      address: "Park entrance"
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Forest Cafe");
      expect(result.value.source).toBe("google_places");
      expect(result.value.rating).toBe(4.5);
    }
  });
});

describe("applyPin / applyUnpin", () => {
  it("promotes the chosen option and demotes the rest to backup", () => {
    const options: StopOption[] = [
      baseStopOption({ id: "a" }),
      baseStopOption({ id: "b", name: "River View", status: "candidate" }),
      baseStopOption({
        id: "c",
        name: "Local Food Garden",
        status: "candidate"
      })
    ];

    const next = applyPin(options, "b");
    const byId = new Map(next.map((o) => [o.id, o.status]));

    expect(byId.get("b")).toBe("pinned");
    expect(byId.get("a")).toBe("backup");
    expect(byId.get("c")).toBe("backup");
  });

  it("ignores removed options when promoting", () => {
    const options: StopOption[] = [
      baseStopOption({ id: "a", status: "removed" }),
      baseStopOption({ id: "b", name: "River View" })
    ];

    const next = applyPin(options, "b");
    expect(next.find((o) => o.id === "a")?.status).toBe("removed");
    expect(next.find((o) => o.id === "b")?.status).toBe("pinned");
  });

  it("moves a pinned option to candidate when unpinned", () => {
    const options: StopOption[] = [
      baseStopOption({ id: "a", status: "pinned" }),
      baseStopOption({ id: "b", status: "backup" })
    ];

    const next = applyUnpin(options);
    expect(next.find((o) => o.id === "a")?.status).toBe("candidate");
    expect(next.find((o) => o.id === "b")?.status).toBe("backup");
  });
});

describe("option selectors", () => {
  const stop: Stop = {
    id: "stop-1",
    tripId: "trip-1",
    dayId: "day-1",
    title: "Lunch",
    status: "pinned",
    pinnedOptionId: "pinned",
    sortOrder: 0,
    options: [
      baseStopOption({ id: "pinned", status: "pinned" }),
      baseStopOption({ id: "backup-1", status: "backup" }),
      baseStopOption({ id: "backup-2", status: "backup" }),
      baseStopOption({ id: "candidate-1", status: "candidate" })
    ]
  };

  it("returns the active option", () => {
    const active = getActiveOption(stop);
    expect(active?.id).toBe("pinned");
  });

  it("returns candidate options excluding the pinned one", () => {
    const candidates = getCandidateOptions(stop);
    expect(candidates.map((o) => o.id)).toEqual(["candidate-1"]);
  });

  it("returns backup options", () => {
    const backups = getBackupOptions(stop);
    expect(backups.map((o) => o.id).sort()).toEqual(
      ["backup-1", "backup-2", "candidate-1"].sort()
    );
  });

  it("sorts backups by rating, then sort order, then name", () => {
    const options = [
      baseStopOption({ id: "x", rating: 3, sortOrder: 0, name: "z" }),
      baseStopOption({ id: "y", rating: 4.5, sortOrder: 0, name: "a" }),
      baseStopOption({ id: "w", rating: 4.5, sortOrder: 1, name: "b" })
    ];
    const sorted = sortBackupOptions(options);
    expect(sorted.map((o) => o.id)).toEqual(["y", "w", "x"]);
  });
});

describe("type guards", () => {
  it("recognises stop statuses", () => {
    expect(isStopStatus("action_needed")).toBe(true);
    expect(isStopStatus("pinned")).toBe(true);
    expect(isStopStatus("draft")).toBe(false);
  });

  it("recognises option statuses", () => {
    expect(isStopOptionStatus("candidate")).toBe(true);
    expect(isStopOptionStatus("removed")).toBe(true);
    expect(isStopOptionStatus("approved")).toBe(false);
  });

  it("recognises option sources", () => {
    expect(isStopOptionSource("ai")).toBe(true);
    expect(isStopOptionSource("google_places")).toBe(true);
    expect(isStopOptionSource("seed")).toBe(false);
  });
});