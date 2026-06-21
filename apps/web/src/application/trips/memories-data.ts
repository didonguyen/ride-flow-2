import type { MemoryRecord } from "@/src/application/trips/types";

export type TripMemoryAsset = {
  altText: string;
  id: string;
  imageUrl: string;
  sortOrder: number;
};

export type TripMemory = {
  assets: TripMemoryAsset[];
  body: string;
  id: string;
  timestamp: string;
  title: string;
};

export type TripVault = {
  journalCount: number;
  photosCount: number;
  placesCount: number;
};

const DEFAULT_MEMORIES: TripMemory[] = [
  {
    id: "mem-1",
    timestamp: "06:30 AM • Sep 12",
    title: "Morning Departure",
    assets: [
      {
        id: "asset-1",
        imageUrl:
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80",
        altText: "Motorcycle parked at a bridge in morning fog",
        sortOrder: 0
      }
    ],
    body:
      "The air was cold and the group rolled out before the city fully woke up."
  },
  {
    id: "mem-2",
    timestamp: "09:15 AM • Sep 12",
    title: "Coffee Stop",
    assets: [
      {
        id: "asset-2",
        imageUrl:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
        altText: "Two mugs of coffee on a wooden table by the coast",
        sortOrder: 0
      }
    ],
    body: "First proper coffee of the ride. The chatter finally slowed down."
  }
];

export function mapMemoryRecords(records: MemoryRecord[]): TripMemory[] {
  return records.map((record) => ({
    id: record.id,
    title: record.title || "Untitled memory",
    body: record.content,
    timestamp: formatTimestamp(record.createdAt),
    assets: record.assets
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((asset) => ({
        id: asset.id,
        imageUrl: asset.imageUrl,
        altText: asset.altText || record.title || "Trip memory",
        sortOrder: asset.sortOrder
      }))
  }));
}

export function getTripMemories(records?: MemoryRecord[]): TripMemory[] {
  if (records) {
    return mapMemoryRecords(records);
  }

  return DEFAULT_MEMORIES;
}

export function getTripVault(memories: TripMemory[]): TripVault {
  return {
    photosCount: memories.reduce((sum, memory) => sum + memory.assets.length, 0),
    journalCount: memories.length,
    placesCount: 0
  };
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric"
  });
}
