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
  stop: number;
  time: string;
  title: string;
  description: string;
  category: "flight" | "hotel" | "food";
  imageUrl: string;
  imageAlt: string;
  rating?: string;
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
  dateRange: string;
  selectedDayId: string;
  days: PlanningDay[];
  agenda: PlanningAgendaItem[];
  mapPins: PlanningMapPin[];
};

export const planningTrips: PlanningTrip[] = [
  {
    id: "da-nang",
    name: "Da Nang Trip",
    dateRange: "Oct 26 - Oct 28, 2025",
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
        imageAlt: "Golden Bridge near Da Nang in soft mountain mist"
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
        rating: "4.5/5"
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
        imageAlt: "Shared seafood dinner plates on a travel table"
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
