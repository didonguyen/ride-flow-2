import { ExternalLink, MapPin, Plus, Trash2, X } from "lucide-react";

import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";

type SelectedItemInspectorProps = {
  item: PlanningAgendaItem | null;
  onAddItem: () => void;
  onClose?: () => void;
  onDeleteItem: (itemId: string) => void;
  onOpenSearch: () => void;
  onUpdateItem: (
    itemId: string,
    patch: Partial<
      Pick<
        PlanningAgendaItem,
        "category" | "description" | "time" | "title"
      >
    >
  ) => void;
  variant?: "desktop" | "mobile";
};

const categoryOptions: PlanningAgendaItem["category"][] = [
  "flight",
  "hotel",
  "food"
];

export function SelectedItemInspector({
  item,
  onAddItem,
  onClose,
  onDeleteItem,
  onOpenSearch,
  onUpdateItem,
  variant = "desktop"
}: SelectedItemInspectorProps) {
  return (
    <aside
      className={[
        "rounded-2xl bg-white p-5 ring-1 ring-slate-200",
        variant === "desktop"
          ? "shadow-2xl shadow-slate-950/15"
          : "shadow-none"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#00565b]">
            Selected stop
          </p>
          <h2 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
            {item ? `Stop ${item.stop || "?"}` : "No stop selected"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {variant === "mobile" && onClose ? (
            <button
              aria-label="Close stop details"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : null}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00565b] text-white transition hover:bg-[#004853]"
            onClick={onAddItem}
            type="button"
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Add stop</span>
          </button>
        </div>
      </div>

      {item ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
              Pinned place
            </p>
            {item.place ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#00565b]/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#00565b]">
                    {item.place.source}
                  </span>
                  <p className="text-sm font-extrabold text-slate-950">
                    {item.place.name}
                  </p>
                </div>
                {item.place.address ? (
                  <p className="text-xs text-slate-500">{item.place.address}</p>
                ) : null}
                {item.place.externalUrl ? (
                  <a
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00565b] hover:underline"
                    href={item.place.externalUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <MapPin aria-hidden="true" className="h-3 w-3" />
                    Open map
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-xs text-slate-500">
                  No place pinned yet for this stop.
                </p>
                <button
                  className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#00565b]/30 bg-white px-3 py-1.5 text-xs font-extrabold text-[#00565b] transition hover:bg-[#00565b]/5"
                  onClick={onOpenSearch}
                  type="button"
                >
                  <MapPin aria-hidden="true" className="h-3 w-3" />
                  Find a place
                </button>
              </div>
            )}
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Title
            </span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
              onChange={(event) =>
                onUpdateItem(item.id, { title: event.target.value })
              }
              value={item.title}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Time
              </span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
                onChange={(event) =>
                  onUpdateItem(item.id, { time: event.target.value })
                }
                value={item.time}
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Type
              </span>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold capitalize text-slate-950 outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
                onChange={(event) =>
                  onUpdateItem(item.id, {
                    category: event.target.value as PlanningAgendaItem["category"]
                  })
                }
                value={item.category}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Notes
            </span>
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
              onChange={(event) =>
                onUpdateItem(item.id, { description: event.target.value })
              }
              value={item.description}
            />
          </label>

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 transition hover:bg-red-100"
            onClick={() => onDeleteItem(item.id)}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Delete stop
          </button>
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Add a new pinned stop or select one from the timeline to edit details.
        </p>
      )}
    </aside>
  );
}
