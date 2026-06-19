"use client";

import { useState } from "react";

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
  const [days, setDays] = useState<DayRailDay[]>([
    { id: "mem-day-1", label: "Day 1", date: "Sep 12", isSelected: true },
    { id: "mem-day-2", label: "Day 2", date: "Sep 13" }
  ]);

  return (
    <section
      aria-label={`Memories for ${tripName}`}
      className="flex flex-col gap-6 px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:gap-8 lg:px-12 lg:py-10"
      data-testid="memories-surface"
      data-trip-id={tripId}
    >
      <TripDayRail
        days={days}
        onAddDay={() => undefined}
        onSelectDay={(id) =>
          setDays((prev) => prev.map((d) => ({ ...d, isSelected: d.id === id })))
        }
      />
      <div className="flex flex-col gap-5">
        {memories.map((memory) => (
          <MemoryEntry
            attribution={memory.attribution}
            attributionInitial={memory.attributionInitial}
            body={memory.body}
            imageAlt={memory.imageAlt}
            imageUrl={memory.imageUrl}
            key={memory.id}
            pinned={Boolean(memory.pinned)}
            timestamp={memory.timestamp}
            title={memory.title}
          />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <TripVaultCard
          journalCount={vault.journalCount}
          photosCount={vault.photosCount}
          placesCount={vault.placesCount}
        />
      </div>
    </section>
  );
}
