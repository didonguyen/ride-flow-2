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
  transport?: string;
  gallery?: string[];
};

export const planningTrips: PlanningTrip[] = [
  {
    id: "nam-cat-tien",
    name: "Nam CÃ¡t TiÃªn Exploration",
    destination: "Nam CÃ¡t TiÃªn, Vietnam",
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
        temperature: "30Â°C",
        isSelected: true
      },
      {
        id: "day-2",
        label: "Day 2",
        date: "Oct 15",
        weatherIcon: "cloud",
        temperature: "28Â°C"
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
          name: "Há»“ ChÃ­ Minh City",
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
          address: "Tá»‰nh lá»™ 2, Äá»“ng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d1-stop-3",
        dayId: "day-1",
        stop: 3,
        time: "12:30 PM",
        title: "Lunch near Nam CÃ¡t TiÃªn",
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
          address: "Nam CÃ¡t TiÃªn, Äá»“ng Nai"
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
          name: "CÃ¡t TiÃªn National Park HQ",
          address: "TÃ¢n PhÃº, Äá»“ng Nai"
        },
        status: "ready"
      },
      {
        id: "nct-d1-stop-5",
        dayId: "day-1",
        stop: 5,
        time: "06:30 PM",
        title: "Sunset at BÃ u Sáº¥u Lake",
        description: "Quiet lake inside the park. Watch the crocs from a safe distance.",
        category: "activity",
        place: {
          id: "bau-sau",
          source: "manual",
          name: "BÃ u Sáº¥u Lake",
          address: "CÃ¡t TiÃªn National Park"
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
          address: "CÃ¡t TiÃªn National Park"
        },
        status: "ready"
      },
      {
        id: "nct-d2-stop-2",
        dayId: "day-2",
        stop: 7,
        time: "09:30 AM",
        title: "Breakfast at the Lodge",
        description: "Phá»Ÿ, bÃ¡nh mÃ¬, and strong coffee.",
        category: "food",
        place: {
          id: "green-hope",
          source: "seed",
          name: "Green Hope Lodge",
          address: "CÃ¡t TiÃªn, Äá»“ng Nai"
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
          name: "Dáº§u GiÃ¢y Petrol Station",
          address: "Quá»‘c lá»™ 1A, Äá»“ng Nai"
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
          name: "Há»“ ChÃ­ Minh City",
          address: "Final Stop"
        },
        status: "ready"
      }
    ],
    mapPins: [
      { stop: 1, label: "Há»“ ChÃ­ Minh City", x: 30, y: 70 },
      { stop: 2, label: "QL20 Rest Stop", x: 55, y: 50 },
      { stop: 3, label: "Forest Cafe", x: 75, y: 40 },
      { stop: 4, label: "Park HQ", x: 80, y: 35 },
      { stop: 5, label: "BÃ u Sáº¥u Lake", x: 85, y: 30 },
      { stop: 6, label: "Safari Route", x: 85, y: 30 },
      { stop: 7, label: "Green Hope Lodge", x: 80, y: 35 },
      { stop: 8, label: "Dáº§u GiÃ¢y", x: 45, y: 60 },
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
        temperature: "30Â°C",
        isSelected: true
      },
      {
        id: "day-2",
        label: "Day 2",
        date: "Sun, Oct 27",
        weatherIcon: "cloud",
        temperature: "29Â°C"
      },
      {
        id: "day-3",
        label: "Day 3",
        date: "Mon, Oct 28",
        weatherIcon: "cloud",
        temperature: "28Â°C"
      }
    ],
    agenda: [
      // -------- Day 1: Arrival + city highlights --------
      {
        id: "dn-d1-stop-1",
        dayId: "day-1",
        stop: 1,
        time: "08:30 AM",
        title: "Depart from HCM",
        description: "Group meeting point at District 1 lobby.",
        category: "flight",
        place: {
          id: "hcm-depart",
          source: "manual",
          name: "Há»“ ChÃ­ Minh City",
          address: "Starting Point"
        },
        status: "confirmed"
      },
      {
        id: "dn-d1-stop-2",
        dayId: "day-1",
        stop: 2,
        time: "10:45 AM",
        title: "Flight to Da Nang",
        description:
          "Morning arrival at Da Nang International Airport. Pick up the rental van and regroup before heading toward the coast.",
        category: "flight",
        place: {
          id: "dad-airport",
          source: "manual",
          name: "Da Nang International Airport",
          address: "Háº£i ChÃ¢u, ÄÃ  Náºµng"
        },
        status: "confirmed"
      },
      {
        id: "dn-d1-stop-3",
        dayId: "day-1",
        stop: 3,
        time: "12:30 PM",
        title: "Lunch at MÃ¬ Quáº£ng áº¤n",
        description:
          "Local turmeric noodles with shrimp and pork. Quick stop near the airport.",
        category: "food",
        imageUrl:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Bowl of Vietnamese noodles with herbs and lime",
        rating: "4.6/5",
        place: {
          id: "mi-quang-an",
          source: "seed",
          name: "MÃ¬ Quáº£ng áº¤n",
          address: "Tráº§n Cao VÃ¢n, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d1-stop-4",
        dayId: "day-1",
        stop: 4,
        time: "03:00 PM",
        title: "Hotel by Han River",
        description:
          "Check in near the Han River bridge. Confirm room groups, freshen up, and pin the meeting point for dinner.",
        category: "hotel",
        imageUrl:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Calm hotel pool and resort terrace",
        rating: "4.5/5",
        place: {
          id: "han-river-hotel",
          source: "seed",
          name: "Han River Boutique Hotel",
          address: "Báº¡ch Äáº±ng, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d1-stop-5",
        dayId: "day-1",
        stop: 5,
        time: "05:30 PM",
        title: "Sunrise / sunset at Cáº§u Rá»“ng",
        description:
          "Walk the Dragon Bridge before its nightly fire-and-water show at 9 PM.",
        category: "activity",
        place: {
          id: "cau-rong",
          source: "manual",
          name: "Cáº§u Rá»“ng (Dragon Bridge)",
          address: "SÆ¡n TrÃ , ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d1-stop-6",
        dayId: "day-1",
        stop: 6,
        time: "07:30 PM",
        title: "Dinner near My Khe Beach",
        description:
          "Seafood dinner beside the beach. Keep this flexible if the group wants a sunset coffee stop first.",
        category: "food",
        imageUrl:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Shared seafood dinner plates on a travel table",
        rating: "4.4/5",
        place: {
          id: "my-khe",
          source: "seed",
          name: "My Khe Beach Club",
          address: "VÃµ NguyÃªn GiÃ¡p, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      // -------- Day 2: Ba Na Hills + Golden Bridge --------
      {
        id: "dn-d2-stop-1",
        dayId: "day-2",
        stop: 7,
        time: "07:30 AM",
        title: "Breakfast at the hotel",
        description: "Buffet breakfast by the river.",
        category: "food",
        place: {
          id: "hotel-breakfast",
          source: "manual",
          name: "Han River Boutique Hotel",
          address: "Báº¡ch Äáº±ng, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d2-stop-2",
        dayId: "day-2",
        stop: 8,
        time: "09:00 AM",
        title: "Drive up to BÃ  NÃ  Hills",
        description:
          "Meet the driver at the lobby, swap the van for the cable car up to BÃ  NÃ .",
        category: "activity",
        place: {
          id: "ba-na",
          source: "manual",
          name: "BÃ  NÃ  Hills Resort",
          address: "HÃ²a Ninh, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d2-stop-3",
        dayId: "day-2",
        stop: 9,
        time: "11:00 AM",
        title: "Golden Bridge photo stop",
        description:
          "Walk the iconic hands-of-gods bridge before the cable car queues build up.",
        category: "activity",
        imageUrl:
          "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Golden Bridge with stone hands holding the walkway",
        rating: "4.8/5",
        place: {
          id: "golden-bridge",
          source: "seed",
          name: "Cáº§u VÃ ng (Golden Bridge)",
          address: "BÃ  NÃ  Hills, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d2-stop-4",
        dayId: "day-2",
        stop: 10,
        time: "01:00 PM",
        title: "Lunch at Beer Plaza",
        description:
          "Buffet lunch with mountain views. Save room for the Fantasy Park rides after.",
        category: "food",
        place: {
          id: "beer-plaza",
          source: "manual",
          name: "BÃ  NÃ  Beer Plaza",
          address: "BÃ  NÃ  Hills"
        },
        status: "ready"
      },
      {
        id: "dn-d2-stop-5",
        dayId: "day-2",
        stop: 11,
        time: "03:00 PM",
        title: "French Village walk",
        description:
          "Stroll the European-style village, snap the cathedral, and ride the alpine coaster.",
        category: "activity",
        place: {
          id: "french-village",
          source: "manual",
          name: "French Village",
          address: "BÃ  NÃ  Hills"
        },
        status: "ready"
      },
      {
        id: "dn-d2-stop-6",
        dayId: "day-2",
        stop: 12,
        time: "06:30 PM",
        title: "Back in town â€” river cruise",
        description:
          "Quick dinner on the Han River and a slow boat under the lit-up bridges.",
        category: "activity",
        place: {
          id: "han-river-cruise",
          source: "seed",
          name: "Han River Cruise",
          address: "Báº¡ch Äáº±ng, ÄÃ  Náºµng"
        },
        status: "ready"
      },
      // -------- Day 3: Hoi An day trip --------
      {
        id: "dn-d3-stop-1",
        dayId: "day-3",
        stop: 13,
        time: "07:00 AM",
        title: "Depart for Há»™i An",
        description:
          "Pack light, the driver is waiting at the lobby. ~45 min ride south.",
        category: "flight",
        place: {
          id: "hoian-depart",
          source: "manual",
          name: "Da Nang â†’ Há»™i An",
          address: "ÄÃ  Náºµng"
        },
        status: "ready"
      },
      {
        id: "dn-d3-stop-2",
        dayId: "day-3",
        stop: 14,
        time: "08:30 AM",
        title: "Ancient Town walk",
        description:
          "Cross the lantern-lit streets before the tour buses arrive. Tailor fittings optional.",
        category: "activity",
        imageUrl:
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Hoi An ancient town with silk lanterns glowing at sunrise",
        rating: "4.9/5",
        place: {
          id: "hoian-ancient",
          source: "seed",
          name: "Há»™i An Ancient Town",
          address: "Phá»‘ cá»• Há»™i An"
        },
        status: "ready"
      },
      {
        id: "dn-d3-stop-3",
        dayId: "day-3",
        stop: 15,
        time: "10:30 AM",
        title: "Cooking class at Báº¿p XÆ°a",
        description:
          "Hands-on class: market tour, then roll your own bÃ¡nh cuá»‘n and cao láº§u.",
        category: "food",
        place: {
          id: "bep-xua",
          source: "seed",
          name: "Báº¿p XÆ°a Há»™i An",
          address: "Cáº©m ChÃ¢u, Há»™i An"
        },
        status: "ready"
      },
      {
        id: "dn-d3-stop-4",
        dayId: "day-3",
        stop: 16,
        time: "01:00 PM",
        title: "Lunch on the river",
        description:
          "Eat what you just cooked overlooking the Thu Bá»“n River.",
        category: "food",
        place: {
          id: "thu-bon",
          source: "manual",
          name: "Thu Bá»“n Riverside",
          address: "Há»™i An"
        },
        status: "ready"
      },
      {
        id: "dn-d3-stop-5",
        dayId: "day-3",
        stop: 17,
        time: "03:30 PM",
        title: "An BÃ ng Beach",
        description:
          "Quiet beach north of Há»™i An. Cold drinks, hammocks, golden hour.",
        category: "activity",
        place: {
          id: "an-bang",
          source: "seed",
          name: "An BÃ ng Beach",
          address: "Cáº©m An, Há»™i An"
        },
        status: "ready"
      },
      {
        id: "dn-d3-stop-6",
        dayId: "day-3",
        stop: 18,
        time: "07:00 PM",
        title: "Lantern-lit dinner",
        description:
          "Candle-lit riverfront dinner. Try the white-rose dumplings and finish with a bia hÆ¡i.",
        category: "food",
        imageUrl:
          "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Lanterns glowing over the river at Hoi An",
        rating: "4.7/5",
        place: {
          id: "lantern-dinner",
          source: "seed",
          name: "Lantern Town Restaurant",
          address: "Nguyá»…n ThÃ¡i Há»c, Há»™i An"
        },
        status: "ready"
      },
      {
        id: "dn-d3-stop-7",
        dayId: "day-3",
        stop: 19,
        time: "09:30 PM",
        title: "Return to Da Nang",
        description:
          "Drop the group at the hotel. Pack the souvenirs for the flight home tomorrow.",
        category: "flight",
        place: {
          id: "dad-return",
          source: "manual",
          name: "Han River Boutique Hotel",
          address: "Final Stop"
        },
        status: "ready"
      }
    ],
    mapPins: [
      { stop: 1, label: "HCM City", x: 18, y: 80 },
      { stop: 2, label: "Da Nang Airport", x: 60, y: 38 },
      { stop: 3, label: "MÃ¬ Quáº£ng áº¤n", x: 58, y: 42 },
      { stop: 4, label: "Han River Hotel", x: 60, y: 50 },
      { stop: 5, label: "Cáº§u Rá»“ng", x: 62, y: 52 },
      { stop: 6, label: "My Khe Beach", x: 70, y: 60 },
      { stop: 7, label: "Hotel", x: 60, y: 50 },
      { stop: 8, label: "BÃ  NÃ  Hills", x: 30, y: 35 },
      { stop: 9, label: "Golden Bridge", x: 32, y: 32 },
      { stop: 10, label: "Beer Plaza", x: 34, y: 30 },
      { stop: 11, label: "French Village", x: 33, y: 28 },
      { stop: 12, label: "Han River Cruise", x: 62, y: 52 },
      { stop: 13, label: "Da Nang", x: 60, y: 55 },
      { stop: 14, label: "Há»™i An", x: 70, y: 75 },
      { stop: 15, label: "Báº¿p XÆ°a", x: 72, y: 78 },
      { stop: 16, label: "Thu Bá»“n", x: 71, y: 76 },
      { stop: 17, label: "An BÃ ng", x: 74, y: 70 },
      { stop: 18, label: "Lantern Town", x: 71, y: 77 },
      { stop: 19, label: "Hotel", x: 60, y: 50 }
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
