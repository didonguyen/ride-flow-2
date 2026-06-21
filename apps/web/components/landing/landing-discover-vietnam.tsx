import { Compass } from "lucide-react";

const REGIONS: {
  name: string;
  description: string;
  top: string;
  left: string;
}[] = [
  { name: "Hanoi", description: "Capital of the north", top: "16%", left: "44%" },
  { name: "Ha Long Bay", description: "Limestone seascape", top: "26%", left: "55%" },
  { name: "Hue", description: "Imperial citadel", top: "48%", left: "50%" },
  { name: "Da Nang", description: "Coastal city", top: "56%", left: "52%" },
  { name: "HCMC", description: "Southern hub", top: "82%", left: "48%" }
];

const ISLANDS: {
  name: string;
  alt: string;
  distance: string;
  top: string;
  left: string;
}[] = [
  {
    name: "Hoàng Sa",
    alt: "Paracel Islands",
    distance: "220 km",
    top: "44%",
    left: "78%"
  },
  {
    name: "Trường Sa",
    alt: "Spratly Islands",
    distance: "250 km",
    top: "78%",
    left: "78%"
  }
];

type LandingDiscoverVietnamProps = {
  className?: string;
};

export function LandingDiscoverVietnam({ className }: LandingDiscoverVietnamProps) {
  return (
    <section
      aria-labelledby="landing-discover-vietnam-heading"
      className={`bg-paper-50 py-16 sm:py-24 ${className ?? ""}`}
      data-testid="landing-discover-vietnam"
      id="discover"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:px-8">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
          <svg
            aria-label="Stylized map of Vietnam"
            className="h-full w-full"
            viewBox="0 0 200 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="vietnam-land" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#E7F2EC" />
                <stop offset="100%" stopColor="#C3ECD7" />
              </linearGradient>
              <pattern id="vietnam-dots" patternUnits="userSpaceOnUse" width="6" height="6">
                <circle cx="2" cy="2" fill="#80BEA6" opacity="0.5" r="0.6" />
              </pattern>
            </defs>
            <path
              d="M70 0 L120 30 L130 90 L150 150 L140 200 L160 260 L150 320 L120 380 L80 360 L60 300 L50 230 L60 160 L40 100 L60 40 Z"
              fill="url(#vietnam-land)"
              stroke="#80BEA6"
              strokeWidth="1.4"
            />
            <path
              d="M70 0 L120 30 L130 90 L150 150 L140 200 L160 260 L150 320 L120 380 L80 360 L60 300 L50 230 L60 160 L40 100 L60 40 Z"
              fill="url(#vietnam-dots)"
            />
            <ellipse cx="60" cy="60" fill="#A8CFBC" opacity="0.4" rx="38" ry="50" />
            <ellipse cx="140" cy="220" fill="#A8CFBC" opacity="0.4" rx="55" ry="70" />
            <text
              fill="#404944"
              fontFamily="Inter, sans-serif"
              fontSize="6"
              fontWeight="600"
              x="20"
              y="350"
            >
              Cambodia
            </text>
            <text
              fill="#404944"
              fontFamily="Inter, sans-serif"
              fontSize="6"
              fontWeight="600"
              x="20"
              y="20"
            >
              China
            </text>
          </svg>
          {REGIONS.map((region) => (
            <div
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
              data-testid={`landing-region-${region.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={region.name}
              style={{ top: region.top, left: region.left }}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-forest-800 bg-paper-50">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-800" />
              </span>
              <span className="rounded-md bg-paper-50/95 px-2 py-0.5 text-[10px] font-semibold text-ink-950 shadow-sm">
                {region.name}
              </span>
            </div>
          ))}
          {ISLANDS.map((island) => (
            <div
              className="absolute flex items-center gap-2"
              data-testid={`landing-island-${island.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={island.name}
              style={{ top: island.top, left: island.left }}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-forest-800 bg-paper-50 text-[9px] font-semibold text-forest-800">
                •
              </span>
              <span className="rounded-md border border-paper-200 bg-paper-50 px-2 py-0.5 text-[10px] font-semibold text-ink-500">
                {island.distance}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <span
            aria-hidden="true"
            className="inline-block h-0.5 w-10 bg-forest-800"
          />
          <h2
            className="font-display text-4xl text-ink-950 sm:text-5xl"
            id="landing-discover-vietnam-heading"
            style={{ letterSpacing: "-0.02em" }}
          >
            Discover
            <br />
            Vietnam
          </h2>
          <p className="max-w-md text-base leading-7 text-ink-700 sm:text-lg">
            We are explorers at heart, and uncovering the hidden gems of
            Vietnam is our passion. We have years of experience. Find out more
            about what the regions of Vietnam have to offer.
          </p>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {ISLANDS.map((island) => (
              <article
                className="flex items-center gap-3 rounded-2xl border border-paper-200 bg-paper-50 p-4"
                data-testid={`landing-region-card-${island.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={island.name}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-200 text-forest-800"
                >
                  <Compass aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-ink-950">
                    {island.name}
                  </span>
                  <span className="text-xs font-medium text-ink-500">
                    ({island.alt})
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
