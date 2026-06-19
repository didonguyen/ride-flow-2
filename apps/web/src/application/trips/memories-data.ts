export type TripMemory = {
  id: string;
  timestamp: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  body: string;
  attribution: string;
  attributionInitial: string;
  pinned?: boolean;
};

const DEFAULT_MEMORIES: TripMemory[] = [
  {
    id: "mem-1",
    timestamp: "06:30 AM • Sep 12",
    title: "Morning Departure: SF Golden Gate",
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Motorcycle parked at the Golden Gate Bridge in morning fog",
    body:
      "The marine layer was thick this morning, but breaking through the fog on the bridge felt like crossing a threshold into the open road. The air was cold, the engine sounded crisp. Ready for the coast.",
    attribution: "Marcus",
    attributionInitial: "M",
    pinned: true
  },
  {
    id: "mem-2",
    timestamp: "09:15 AM • Sep 12",
    title: "Half Moon Bay Coffee Stop",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Two mugs of coffee on a wooden table by the coast",
    body:
      "First proper coffee of the ride. The group settled into a corner booth and the chatter finally slowed down. Even An admitted the fog was worth it for this view.",
    attribution: "Sarah",
    attributionInitial: "S"
  }
];

export function getTripMemories(): TripMemory[] {
  return DEFAULT_MEMORIES;
}

export function getTripVault(): {
  photosCount: number;
  journalCount: number;
  placesCount: number;
} {
  return {
    photosCount: 48,
    journalCount: 7,
    placesCount: 12
  };
}
