import { Plus, Trash2 } from "lucide-react";

import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";

type SelectedItemInspectorProps = {
  item: PlanningAgendaItem | null;
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItem: (
    itemId: string,
    patch: Partial<
      Pick<
        PlanningAgendaItem,
        "category" | "description" | "time" | "title"
      >
    >
  ) => void;
};

const categoryOptions: PlanningAgendaItem["category"][] = [
  "flight",
  "hotel",
  "food"
];

export function SelectedItemInspector({
  item,
  onAddItem,
  onDeleteItem,
  onUpdateItem
}: SelectedItemInspectorProps) {
  return (
    <aside className="rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15 ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#00565b]">
            Selected stop
          </p>
          <h2 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
            {item ? `Stop ${item.stop}` : "No stop selected"}
          </h2>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00565b] text-white transition hover:bg-[#004853]"
          onClick={onAddItem}
          type="button"
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Add stop</span>
        </button>
      </div>

      {item ? (
        <div className="mt-5 space-y-4">
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
