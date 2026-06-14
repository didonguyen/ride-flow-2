import { Bed, Map, Plane, Star, Utensils } from "lucide-react";

import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";

type ItineraryTimelineProps = {
  agenda: PlanningAgendaItem[];
};

const categoryIcons = {
  flight: Plane,
  hotel: Bed,
  food: Utensils
} as const;

export function ItineraryTimeline({ agenda }: ItineraryTimelineProps) {
  return (
    <section
      aria-label="Day agenda"
      className="relative space-y-10 pl-14 sm:pl-20"
    >
      <div className="absolute bottom-8 left-[1.32rem] top-7 border-l border-dashed border-slate-300 sm:left-[1.7rem]" />

      {agenda.map((item) => {
        const CategoryIcon = categoryIcons[item.category];

        return (
          <article className="relative" key={item.id}>
            <div className="absolute -left-14 top-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#00565b] text-lg font-extrabold text-white shadow-md shadow-[#00565b]/20 sm:-left-20">
              {item.stop}
            </div>

            <div className="grid w-full min-w-0 max-w-[18.5rem] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 sm:max-w-none md:grid-cols-[minmax(0,1fr)_200px]">
              <div className="px-6 py-6 sm:px-7">
                <div className="flex items-center gap-3 text-sm font-extrabold text-[#00565b]">
                  <CategoryIcon aria-hidden="true" className="h-4 w-4" />
                  {item.time}
                </div>
                <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-[36rem] text-base leading-7 text-slate-600">
                  {item.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm font-medium text-slate-500">
                  {item.rating ? (
                    <span className="inline-flex items-center gap-2">
                      <Star aria-hidden="true" className="h-4 w-4" />
                      {item.rating}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <Map aria-hidden="true" className="h-4 w-4" />
                    Directions
                  </span>
                </div>
              </div>

              <div
                aria-label={item.imageAlt}
                className="min-h-[180px] bg-slate-200 md:min-h-full"
                role="img"
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
