import Image from "next/image";
import { MapPin } from "lucide-react";

type TripCoverHeaderProps = {
  tripName: string;
  destination: string;
  coverImageUrl: string;
  gallery?: string[];
};

const defaultCoverImage =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80";

export function TripCoverHeader({
  tripName,
  destination,
  coverImageUrl,
  gallery = []
}: TripCoverHeaderProps) {
  const safeCover = coverImageUrl || defaultCoverImage;
  const thumbs = (gallery.length > 0 ? gallery : [safeCover]).slice(0, 4);

  return (
    <section
      aria-label={`${tripName} cover`}
      className="relative -mx-5 -mt-8 h-[60svh] overflow-hidden bg-forest-900 animate-rideflow-cover-fade sm:-mx-8 sm:h-[420px] lg:-mx-12 lg:h-[480px]"
    >
      <Image
        alt={`Cover photo for ${tripName}`}
        className="object-cover"
        fill
        priority
        sizes="100vw"
        src={safeCover}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-forest-900/95 via-forest-900/40 to-transparent"
      />
      <div className="absolute inset-x-5 bottom-6 z-10 sm:inset-x-8 lg:inset-x-12 lg:bottom-10">
        <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
          {tripName}
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white/85 sm:text-base">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          {destination}
        </p>
      </div>
      <div
        className="absolute bottom-6 right-5 z-10 flex max-w-[55%] gap-2 overflow-x-auto pb-1 lg:right-12 lg:bottom-10 lg:max-w-none lg:flex-col lg:gap-3"
        style={{ scrollbarWidth: "none" }}
      >
        {thumbs.map((src, i) => (
          <div
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/40 transition lg:h-20 lg:w-20 ${
              i === 0 ? "ring-white" : ""
            }`}
            key={`${src}-${i}`}
          >
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover"
              fill
              sizes="80px"
              src={src}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
