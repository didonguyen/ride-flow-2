import Image from "next/image";
import { Star } from "lucide-react";

type Destination = {
  name: string;
  country: string;
  imageUrl: string;
  rating: number;
};

const destinations: Destination[] = [
  {
    name: "La Costa",
    country: "Peru, South America",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8
  },
  {
    name: "Rio Verde",
    country: "Brazil, South America",
    imageUrl:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80",
    rating: 4.6
  },
  {
    name: "Kyoto Bloom",
    country: "Japan, Asia",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9
  },
  {
    name: "Atlas Dunes",
    country: "Morocco, Africa",
    imageUrl:
      "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=600&q=80",
    rating: 4.7
  },
  {
    name: "Reykjavik Lights",
    country: "Iceland, Europe",
    imageUrl:
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=600&q=80",
    rating: 4.8
  },
  {
    name: "Sierra Mist",
    country: "Peru, South America",
    imageUrl:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80",
    rating: 4.5
  }
];

export function LandingTopDestinations() {
  return (
    <section
      aria-labelledby="landing-top-destinations-heading"
      className="bg-cream-50 py-16 sm:py-20 animate-rideflow-cover-fade"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-700">
              Handpicked
            </p>
            <h2
              className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-4xl"
              id="landing-top-destinations-heading"
            >
              Top destinations right now
            </h2>
          </div>
        </div>

        <ul
          aria-label="Top destinations"
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {destinations.map((destination) => (
            <li
              className="group w-44 flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-rideflow-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-rideflow-card-hover sm:w-auto"
              key={destination.name}
            >
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  alt={`${destination.name} travel destination`}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 176px"
                  src={destination.imageUrl}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-extrabold tracking-[-0.01em] text-slate-950">
                  {destination.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {destination.country}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-mint-400/15 px-2 py-1 text-xs font-extrabold text-forest-900">
                  <Star
                    aria-hidden="true"
                    className="h-3 w-3 text-amber-400"
                    fill="currentColor"
                  />
                  <span>{destination.rating.toFixed(1)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
