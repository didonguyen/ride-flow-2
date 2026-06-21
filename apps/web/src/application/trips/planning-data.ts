export type PlanningDay = {
  id: string;
  label: string;
  date: string;
  weatherIcon: "sun" | "cloud";
  temperature: string;
  isSelected?: boolean;
};

export type PlanningAgendaItem = {
  id: string;
  dayId?: string;
  stop: number;
  time: string;
  title: string;
  description: string;
  category: "flight" | "hotel" | "food" | "fuel" | "activity" | "stop";
  imageUrl?: string;
  imageAlt?: string;
  rating?: string;
  place?: {
    id: string;
    source: "seed" | "osm" | "manual" | "google";
    name: string;
    address?: string;
    lat?: number;
    lng?: number;
    externalUrl?: string;
    imageUrl?: string;
  };
  status?: "confirmed" | "ready" | "pending";
};

export type PlanningMapPin = {
  stop: number;
  label: string;
  x: number;
  y: number;
};

export type PlanningTrip = {
  id: string;
  name: string;
  destination?: string;
  dateRange: string;
  selectedDayId: string;
  days: PlanningDay[];
  agenda: PlanningAgendaItem[];
  mapPins: PlanningMapPin[];
  coverImageUrl?: string;
  gallery?: string[];
};

export const planningTrips: PlanningTrip[] = [
  {
    id: "nam-cat-tien",
    name: "Nam Cát Tiên Exploration",
    destination: "Nam Cát Tiên, Vietnam",
    dateRange: "Oct 14-15, 2025",
    coverImageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80"
    ],
    selectedDayId: "day-1",
    days: [
      {
        id: "day-1",
        label: "Day 1",
        date: "Oct 14",
        weatherIcon: "sun",
        temperature: "30°C",
        isSelected: true
      },
      {
        id: "day-2",
        label: "Day 2",
        date: "Oct 15",
        weatherIcon: "cloud",
        temperature: "28°C"
      }
    ],
    agenda: [
      {
        id: "nct-d1-stop-1",
        dayId: "day-1",
        stop: 1,
        time: "07:00 AM",
        title: "Depart from HCM",
        description: "Starting Point",
        category: "flight",
        place: {
          id: "hcm",
          source: "manual",
          name: "Hồ Chí Minh City",
          address: "Starting Point"
        },
        status: "confirmed"
      },
      {
        id: "nct-d1-stop-2",
        dayId: "day-1",
        stop: 2,
        time: "09:30 AM",
        title: "Coffee & Fuel",
        description: "Pit stop along QL20.",
        category: "fuel",
        place: {
          id: "ql20",
          source: "manual",
          name: "Highway QL20 Rest Stop",
          address: "Tỉnh lộ 2, Đồng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d1-stop-3",
        dayId: "day-1",
        stop: 3,
        time: "12:30 PM",
        title: "Lunch near Nam Cát Tiên",
        description: "Local Vietnamese cuisine with river views.",
        category: "food",
        imageUrl:
          "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Forest cafe deck overlooking a quiet river",
        rating: "4.5/5",
        place: {
          id: "forest-cafe",
          source: "seed",
          name: "Forest Cafe",
          address: "Nam Cát Tiên, Đồng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d1-stop-4",
        dayId: "day-1",
        stop: 4,
        time: "03:30 PM",
        title: "Jungle Trek Check-in",
        description: "Meet your guide, lock the bikes, and stretch your legs.",
        category: "activity",
        place: {
          id: "park-headquarters",
          source: "manual",
          name: "Cát Tiên National Park HQ",
          address: "Tân Phú, Đồng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d1-stop-5",
        dayId: "day-1",
        stop: 5,
        time: "06:30 PM",
        title: "Sunset at Bàu Sấu Lake",
        description: "Quiet lake inside the park. Watch the crocs from a safe distance.",
        category: "activity",
        place: {
          id: "bau-sau",
          source: "manual",
          name: "Bàu Sấu Lake",
          address: "Cát Tiên National Park"
        },
        status: "ready"
      },
      {
        id: "nct-d2-stop-1",
        dayId: "day-2",
        stop: 6,
        time: "06:00 AM",
        title: "Sunrise Safari Drive",
        description: "Spot deer and wild boar with the park rangers.",
        category: "activity",
        imageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Sunrise over the forest canopy",
        rating: "4.7/5",
        place: {
          id: "safari-route",
          source: "manual",
          name: "Safari Route A",
          address: "Cát Tiên National Park"
        },
        status: "ready"
      },
      {
        id: "nct-d2-stop-2",
        dayId: "day-2",
        stop: 7,
        time: "09:30 AM",
        title: "Breakfast at the Lodge",
        description: "Phở, bánh mì, and strong coffee.",
        category: "food",
        place: {
          id: "green-hope",
          source: "seed",
          name: "Green Hope Lodge",
          address: "Cát Tiên, Đồng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d2-stop-3",
        dayId: "day-2",
        stop: 8,
        time: "12:00 PM",
        title: "Pack up and refuel",
        description: "Top up the tank and check tire pressure for the ride back.",
        category: "fuel",
        place: {
          id: "dau-giay",
          source: "manual",
          name: "Dầu Giây Petrol Station",
          address: "Quốc lộ 1A, Đồng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d2-stop-4",
        dayId: "day-2",
        stop: 9,
        time: "03:30 PM",
        title: "Return to HCM",
        description: "Roll back into the city before rush hour.",
        category: "flight",
        place: {
          id: "hcm-return",
          source: "manual",
          name: "Hồ Chí Minh City",
          address: "Final Stop"
        },
        status: "ready"
      }
    ],
    mapPins: [
      { stop: 1, label: "Hồ Chí Minh City", x: 30, y: 70 },
      { stop: 2, label: "QL20 Rest Stop", x: 55, y: 50 },
      { stop: 3, label: "Forest Cafe", x: 75, y: 40 },
      { stop: 4, label: "Park HQ", x: 80, y: 35 },
      { stop: 5, label: "Bàu Sấu Lake", x: 85, y: 30 },
      { stop: 6, label: "Safari Route", x: 85, y: 30 },
      { stop: 7, label: "Green Hope Lodge", x: 80, y: 35 },
      { stop: 8, label: "Dầu Giây", x: 45, y: 60 },
      { stop: 9, label: "HCM", x: 30, y: 70 }
    ]
  },
  {
    id: "da-nang",
    name: "Da Nang Trip",
    destination: "Da Nang, Vietnam",
    dateRange: "Oct 26 - Oct 28, 2025",
    coverImageUrl:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80"
    ],
    selectedDayId: "day-1",
    days: [
      {
        id: "day-1",
        label: "Day 1",
        date: "Sat, Oct 26",
        weatherIcon: "sun",
        temperature: "72°F",
        isSelected: true
      },
      {
        id: "day-2",
        label: "Day 2",
        date: "Sun, Oct 27",
        weatherIcon: "cloud",
        temperature: "68°F"
      },
      {
        id: "day-3",
        label: "Day 3",
        date: "Mon, Oct 28",
        weatherIcon: "cloud",
        temperature: "65°F"
      }
    ],
    agenda: [
      {
        id: "flight-da-nang",
        stop: 1,
        time: "10:45 AM",
        title: "Flight to Da Nang",
        description:
          "Morning arrival at Da Nang International Airport. Pick up rental van and regroup before heading toward the coast.",
        category: "flight",
        imageUrl:
          "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=520&q=85",
        imageAlt: "Golden Bridge near Da Nang in soft mountain mist",
        status: "ready"
      },
      {
        id: "hotel-riverside",
        stop: 2,
        time: "3:00 PM",
        title: "Hotel by Han River",
        description:
          "Check in near the Han River bridge. Confirm room groups, freshen up, and pin the meeting point for dinner.",
        category: "hotel",
        imageUrl:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=520&q=85",
        imageAlt: "Calm hotel pool and resort terrace",
        rating: "4.5/5",
        status: "ready"
      },
      {
        id: "dinner-my-khe",
        stop: 3,
        time: "7:30 PM",
        title: "Dinner near My Khe Beach",
        description:
          "Seafood dinner beside the beach. Keep this flexible if the group wants a sunset coffee stop first.",
        category: "food",
        imageUrl:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=520&q=85",
        imageAlt: "Shared seafood dinner plates on a travel table",
        status: "ready"
      }
    ],
    mapPins: [
      { stop: 1, label: "Da Nang Airport", x: 72, y: 35 },
      { stop: 2, label: "Han River Hotel", x: 44, y: 47 },
      { stop: 3, label: "My Khe Beach", x: 78, y: 76 }
    ]
  }
];

export function getPlanningTripById(tripId: string) {
  return planningTrips.find((trip) => trip.id === tripId);
}

const defaultCoverImages = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
];

const defaultGallery = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=400&q=80"
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function pickTripCoverImage(seed: string) {
  return defaultCoverImages[hashSeed(seed) % defaultCoverImages.length];
}

export function pickTripGallery(seed: string) {
  const offset = hashSeed(seed) % defaultGallery.length;
  return Array.from({ length: 4 }, (_, i) => defaultGallery[(offset + i) % defaultGallery.length]);
}

export function agendaForDay(
  trip: PlanningTrip,
  dayId: string
): PlanningAgendaItem[] {
  const matches = trip.agenda.filter((item) => item.dayId === dayId);
  if (matches.length > 0) {
    return matches;
  }
  return trip.agenda;
}
