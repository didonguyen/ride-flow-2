export type DashboardTrip = {
  id: string;
  name: string;
  destination: string;
  region: string;
  dateRange: string;
  daysLabel?: string;
  imageUrl: string;
  imageAlt: string;
  rating?: number;
  transport?: string;
};

export const dashboardTrips: DashboardTrip[] = [
  {
    id: "da-nang",
    name: "Da Nang Trip",
    destination: "Vietnam, South East Asia",
    region: "Da Nang, Vietnam",
    dateRange: "May 10 - May 16, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Golden Bridge in Da Nang surrounded by misty mountains",
    rating: 4.8
  },
  {
    id: "japan-spring",
    name: "Japan Spring Escape",
    destination: "Kyoto, Japan",
    region: "Kyoto and Fuji route",
    dateRange: "Apr 3 - Apr 12, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Cherry blossoms framing a spring Japan travel scene",
    rating: 4.9
  },
  {
    id: "bali-surf",
    name: "Bali Surf & Chill",
    destination: "Uluwatu, Indonesia",
    region: "South Bali coast",
    dateRange: "Feb 14 - Feb 21, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Palm trees beside a quiet tropical beach in Bali",
    rating: 4.7
  }
];

export const dashboardCreateTripCta = {
  title: "Bắt đầu chuyến đi mới",
  subtitle: "Plan your next journey"
} as const;
