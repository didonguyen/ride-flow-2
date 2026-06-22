"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";

import { TripVaultCard } from "@/components/trip/trip-vault-card";
import { ActionModal } from "@/components/ui/action-modal";
import { getTripVault, type TripMemory } from "@/src/application/trips/memories-data";

type MemoriesSurfaceProps = {
  addMemoryAction?: (formData: FormData) => Promise<void> | void;
  deleteMemoryAction?: (formData: FormData) => Promise<void> | void;
  memories?: TripMemory[];
  tripId: string;
  tripName: string;
};

export function MemoriesSurface({
  addMemoryAction,
  deleteMemoryAction,
  memories = [],
  tripId,
  tripName
}: MemoriesSurfaceProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [deletingMemory, setDeletingMemory] = useState<TripMemory | null>(null);
  const vault = getTripVault(memories);

  return (
    <section
      aria-label={`Memories for ${tripName}`}
      className="grid gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-10 lg:py-10"
      data-testid="memories-surface"
      data-trip-id={tripId}
    >
      <ActionModal
        description="Upload trip photos and add an optional note for this memory."
        onOpenChange={setShowAdd}
        open={showAdd}
        title="Add memory"
      >
        <form
          action={addMemoryAction}
          className="grid gap-4"
          data-testid="memories-add-form"
          encType="multipart/form-data"
        >
          <input name="tripId" type="hidden" value={tripId} />
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
            Title
            <input
              className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
              name="title"
              placeholder="Lantern-lit dinner"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
            Content
            <textarea
              className="min-h-28 rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
              name="content"
              placeholder="What do you want to remember?"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
            Images
            <input
              accept="image/*"
              className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950"
              multiple
              name="images"
              type="file"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
              data-testid="memories-add-submit"
              type="submit"
            >
              <ImagePlus aria-hidden="true" className="h-4 w-4" />
              Save memory
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-forest-800/30 bg-white px-4 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-800/5"
              data-testid="memories-add-dismiss"
              type="button"
              onClick={() => setShowAdd(false)}
            >
              Dismiss
            </button>
          </div>
        </form>
      </ActionModal>

      <ActionModal
        description={
          deletingMemory
            ? `This removes "${deletingMemory.title}" and its photos from this trip view.`
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) setDeletingMemory(null);
        }}
        open={Boolean(deletingMemory)}
        title="Delete memory"
      >
        {deletingMemory ? (
          <form action={deleteMemoryAction} className="flex flex-wrap gap-2">
            <input name="tripId" type="hidden" value={tripId} />
            <input name="memoryId" type="hidden" value={deletingMemory.id} />
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              data-testid={`memories-delete-confirm-${deletingMemory.id}`}
              type="submit"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete memory
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
              type="button"
              onClick={() => setDeletingMemory(null)}
            >
              Cancel
            </button>
          </form>
        ) : null}
      </ActionModal>

      <div className="flex flex-col gap-5">
        {memories.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-paper-200 bg-paper-50 p-8 text-center text-sm text-ink-500"
            data-testid="memories-empty"
          >
            No memories yet. Add photos during or after your trip.
          </div>
        ) : (
          <ol className="grid gap-5" data-testid="memories-timeline">
            {memories.map((memory) => (
              <li data-testid={`memories-entry-${memory.id}`} key={memory.id}>
                <article className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                        {memory.timestamp}
                      </span>
                      <h3 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink-950">
                        {memory.title}
                      </h3>
                    </div>
                    {deleteMemoryAction ? (
                      <button
                        aria-label={`Delete ${memory.title}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-700 transition hover:bg-red-100"
                        data-testid={`memories-delete-${memory.id}`}
                        type="button"
                        onClick={() => setDeletingMemory(memory)}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  {memory.assets.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {memory.assets.map((asset, index) => (
                        <div
                          className={index === 0 ? "sm:col-span-2" : ""}
                          key={asset.id}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-paper-100 ring-1 ring-paper-200">
                            <Image
                              alt={asset.altText}
                              className="object-cover"
                              fill
                              sizes="(min-width: 1024px) 55vw, 100vw"
                              src={asset.imageUrl}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {memory.body ? (
                    <p className="text-base leading-7 text-ink-700">
                      {memory.body}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <TripVaultCard
          journalCount={vault.journalCount}
          onAddMemory={() => setShowAdd(true)}
          photosCount={vault.photosCount}
          placesCount={vault.placesCount}
        />
      </div>
    </section>
  );
}