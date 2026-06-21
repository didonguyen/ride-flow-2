"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";

import { MemoryEntry } from "@/components/trip/memory-entry";
import { TripDayRail, type DayRailDay } from "@/components/trip/trip-day-rail";
import { TripVaultCard } from "@/components/trip/trip-vault-card";
import {
  getTripMemories,
  getTripVault
} from "@/src/application/trips/memories-data";

type MemoriesSurfaceProps = {
  tripId: string;
  tripName: string;
};

export function MemoriesSurface({ tripId, tripName }: MemoriesSurfaceProps) {
  const memories = getTripMemories();
  const vault = getTripVault();
  const [showAdd, setShowAdd] = useState(false);
  const [days, setDays] = useState<DayRailDay[]>([
    { id: "mem-day-1", label: "Day 1", date: "Sep 12", isSelected: true },
    { id: "mem-day-2", label: "Day 2", date: "Sep 13" }
  ]);

  return (
    <section
      aria-label={`Memories for ${tripName}`}
      className="grid gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[200px_minmax(0,1fr)_320px] lg:gap-10 lg:px-10 lg:py-10"
      data-testid="memories-surface"
      data-trip-id={tripId}
    >
      <TripDayRail
        days={days}
        onAddDay={() =>
          setDays((prev) => [
            ...prev,
            {
              id: `mem-day-${prev.length + 1}`,
              label: `Day ${prev.length + 1}`,
              date: "Sep 14"
            }
          ])
        }
        onSelectDay={(id) =>
          setDays((prev) => prev.map((d) => ({ ...d, isSelected: d.id === id })))
        }
      />
      <div className="flex flex-col gap-5">
        {showAdd ? (
          <div
            className="rounded-2xl border border-dashed border-forest-800/40 bg-sage-100 p-5 text-sm text-forest-800"
            data-testid="memories-add-confirmation"
          >
            <p className="font-semibold">Add Memory</p>
            <p className="mt-1 text-xs">
              Drop a photo, pick a stop, and add a caption. We&apos;ll save the
              draft here.
            </p>
            <button
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-forest-800/40 bg-paper-50 px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:border-forest-800"
              data-testid="memories-add-dismiss"
              type="button"
              onClick={() => setShowAdd(false)}
            >
              Dismiss
            </button>
          </div>
        ) : null}
        <ol className="relative flex flex-col gap-5" data-testid="memories-timeline">
          <span
            aria-hidden="true"
            className="absolute left-3 top-4 bottom-4 w-px border-l border-dashed border-sage-300"
          />
          {memories.map((memory) => (
            <li
              className="relative pl-10 sm:pl-12"
              data-testid={`memories-entry-${memory.id}`}
              key={memory.id}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-forest-800 bg-paper-50 text-forest-800"
              >
                <MapPin aria-hidden="true" className="h-3 w-3" />
              </span>
              <MemoryEntry
                attribution={memory.attribution}
                attributionInitial={memory.attributionInitial}
                body={memory.body}
                imageAlt={memory.imageAlt}
                imageUrl={memory.imageUrl}
                pinned={Boolean(memory.pinned)}
                timestamp={memory.timestamp}
                title={memory.title}
              />
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-5">
        <TripVaultCard
          journalCount={vault.journalCount}
          onAddMemory={() => setShowAdd(true)}
          photosCount={vault.photosCount}
          placesCount={vault.placesCount}
        />
      </div>
    </section>
  );
}
