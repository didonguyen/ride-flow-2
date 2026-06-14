import { Download, MapPin } from "lucide-react";

type MemoryEntry = {
  id: string;
  dayLabel: string;
  location: string;
  coordinates: string;
  weatherLine: string;
  caption: string;
  photoUrl: string;
  stamp: string;
};

const seedMemories: MemoryEntry[] = [
  {
    id: "memory-1",
    dayLabel: "Day 32",
    location: "Sri Lanka - Ella",
    coordinates: "6°52'54\"N 81°02'21\"E",
    weatherLine: "OCTOBER 29TH, SUNNY 27°C, ALTITUDE 3,415FT.",
    caption:
      "This train ride is famous for a reason. I met locals and soaked in tea field views for six hours.",
    photoUrl:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85",
    stamp: "DAY 32"
  },
  {
    id: "memory-2",
    dayLabel: "Day 18",
    location: "Hiriketiya Beach, Sri Lanka",
    coordinates: "5°57'36\"N 80°43'48\"E",
    weatherLine: "OCTOBER 15TH, SUNNY 28°C.",
    caption: "Surf town sunsets, beach bars, and a hostel full of great people.",
    photoUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=85",
    stamp: "DAY 18"
  }
];

type MemoriesSurfaceProps = {
  tripId: string;
  tripName: string;
};

export function MemoriesSurface({ tripId, tripName }: MemoriesSurfaceProps) {
  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00565b]">
              {tripName}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-slate-950 sm:text-4xl">
              {seedMemories[0]?.dayLabel ?? "Memories"} — {seedMemories[0]?.location ?? "Coming soon"}
            </h1>
          </div>
          <button
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#00565b] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#004853]"
            type="button"
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Export as PDF Album
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              <MapPin aria-hidden="true" className="h-4 w-4 text-slate-400" />
              {seedMemories[0]?.location}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {seedMemories[0]?.coordinates}
            </p>
            <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate-700">
              {seedMemories[0]?.caption}
            </p>
            <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              {seedMemories[0]?.weatherLine}
            </p>
            <span className="mt-3 inline-block -rotate-3 rounded-md border-2 border-dashed border-slate-300 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              {seedMemories[0]?.stamp}
            </span>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
              <img
                alt={seedMemories[0]?.location ?? ""}
                className="aspect-[4/3] w-full object-cover"
                src={seedMemories[0]?.photoUrl ?? ""}
              />
            </figure>
            <figure className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 sm:translate-y-8">
              <img
                alt="Safari truck"
                className="aspect-[4/3] w-full object-cover"
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=85"
              />
            </figure>
            <figure className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 sm:col-span-2">
              <img
                alt="Beach sunset"
                className="aspect-[16/9] w-full object-cover"
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1100&q=85"
              />
            </figure>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500" data-testid="memories-shell">
          Memories demo surface · Trip {tripId} · Full photo storage comes in a later spec.
        </p>
      </div>
    </section>
  );
}
