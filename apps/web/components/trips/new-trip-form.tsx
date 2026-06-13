"use client";

type NewTripFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

const inputClassName =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-600 transition focus:border-sky-600 focus:ring-2";

export function NewTripForm({ action }: NewTripFormProps) {
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">
          Trip name
        </label>
        <input
          autoComplete="off"
          className={inputClassName}
          id="name"
          name="name"
          placeholder="Da Nang Food Trip"
          required
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="destination">
          Destination
        </label>
        <input
          autoComplete="off"
          className={inputClassName}
          id="destination"
          name="destination"
          placeholder="Da Nang"
          required
          type="text"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="startDate">
            Start date
          </label>
          <input
            className={inputClassName}
            id="startDate"
            name="startDate"
            required
            type="date"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="endDate">
            End date
          </label>
          <input
            className={inputClassName}
            id="endDate"
            name="endDate"
            required
            type="date"
          />
        </div>
      </div>

      <button
        className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 sm:w-auto"
        type="submit"
      >
        Create trip
      </button>
    </form>
  );
}
