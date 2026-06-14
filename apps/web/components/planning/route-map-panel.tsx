import type { PlanningMapPin } from "@/src/application/trips/planning-data";

type RouteMapPanelProps = {
  onSelectStop?: (stop: number) => void;
  pins: PlanningMapPin[];
  selectedStop?: number | null;
};

export function RouteMapPanel({
  onSelectStop,
  pins,
  selectedStop
}: RouteMapPanelProps) {
  return (
    <section
      aria-label="Route map preview"
      className="relative min-h-[560px] overflow-hidden bg-[#f4f7f6] shadow-inner lg:min-h-[calc(100vh-17rem)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_0_28%,rgba(62,169,214,0.46)_28%_39%,transparent_39%_100%),linear-gradient(160deg,transparent_0_58%,rgba(62,169,214,0.38)_58%_66%,transparent_66%_100%),linear-gradient(38deg,transparent_0_70%,rgba(62,169,214,0.35)_70%_80%,transparent_80%_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_78%,rgba(103,194,120,0.32),transparent_9rem),radial-gradient(circle_at_60%_60%,rgba(226,226,226,0.9),transparent_18rem)]" />
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(148,163,184,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.24)_1px,transparent_1px)] [background-size:64px_64px]" />

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M72 35 C60 39 52 41 44 47 L60 50 L64 66 C70 70 74 73 78 76"
          fill="none"
          stroke="#168086"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>

      {pins.map((pin) => (
        <button
          aria-pressed={selectedStop === pin.stop ? "true" : "false"}
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center"
          key={pin.stop}
          onClick={() => onSelectStop?.(pin.stop)}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          type="button"
        >
          <div
            className={[
              "flex h-14 w-12 items-center justify-center rounded-t-full rounded-bl-full text-lg font-extrabold text-white shadow-lg shadow-slate-900/20 ring-4 transition",
              selectedStop === pin.stop
                ? "bg-[#004853] ring-[#b9f5ea]"
                : "bg-[#13848a] ring-white/70"
            ].join(" ")}
          >
            {pin.stop}
          </div>
          <div className="-ml-1 hidden rounded-r-full bg-white px-4 py-2 text-sm font-extrabold text-slate-600 shadow-md ring-1 ring-slate-200 xl:block">
            {pin.stop}. {pin.label}
          </div>
        </button>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/75 to-transparent" />
    </section>
  );
}
