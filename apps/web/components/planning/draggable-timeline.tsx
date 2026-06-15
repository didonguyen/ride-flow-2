"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";

import { ItineraryTimeline } from "@/components/planning/itinerary-timeline";
import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";
import { pixelDeltaToTimelineMinutes } from "@/src/domain/timeline";

type DraggableTimelineProps = {
  agenda: PlanningAgendaItem[];
  pixelsPerHour?: number;
  onMoveItem?: (input: { itemId: string; minutesSinceMidnight: number }) => void;
  onSelectItem?: (itemId: string) => void;
  selectedItemId?: string | null;
};

export function DraggableTimeline({
  agenda,
  pixelsPerHour = 80,
  onMoveItem,
  onSelectItem,
  selectedItemId
}: DraggableTimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const activeItemId = String(event.active.id);
    const deltaY = event.delta.y;
    const item = agenda.find((entry) => entry.id === activeItemId);
    if (!item) {
      return;
    }
    const originalMinutes = parseAgendaTimeToMinutes(item.time);
    const targetMinutes = pixelDeltaToTimelineMinutes({
      originalMinutes,
      deltaY,
      pixelsPerHour
    });
    if (targetMinutes === originalMinutes) {
      return;
    }
    onMoveItem?.({ itemId: activeItemId, minutesSinceMidnight: targetMinutes });
  }

  return (
    <DndContext
      sensors={sensors}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveId(String(event.active.id))}
    >
      <ItineraryTimeline
        agenda={agenda}
        onSelectItem={onSelectItem}
        renderItem={(item) => (
          <DraggableItem
            id={item.id}
            isSelected={selectedItemId === item.id}
          >
            <DraggableItemSurface item={item} />
          </DraggableItem>
        )}
        selectedItemId={selectedItemId}
      />
      {activeId ? <span aria-live="polite" className="sr-only">Dragging item</span> : null}
    </DndContext>
  );
}

type DraggableItemProps = {
  children: ReactNode;
  id: string;
  isSelected: boolean;
};

function DraggableItem({ children, id, isSelected }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id
  });
  const inlineStyle: CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={inlineStyle}
      {...listeners}
      {...attributes}
      aria-grabbed={isDragging}
      aria-label={`Drag ${id} up or down to change its time`}
      data-selected={isSelected ? "true" : "false"}
    >
      {children}
    </div>
  );
}

function DraggableItemSurface({ item }: { item: PlanningAgendaItem }) {
  return (
    <div className="grid w-full min-w-0 max-w-[18.5rem] overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-[#00565b]/35 sm:max-w-none md:grid-cols-[minmax(0,1fr)_200px]">
      <div className="px-6 py-6 sm:px-7">
        <div className="flex items-center gap-3 text-sm font-extrabold text-[#00565b]">
          <span>{item.time}</span>
        </div>
        <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
          {item.title}
        </h2>
        <p className="mt-3 max-w-[36rem] text-base leading-7 text-slate-600">
          {item.description}
        </p>
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
  );
}

function parseAgendaTimeToMinutes(label: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!match) {
    return 0;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  let hour24 = hours % 12;
  if (meridiem === "PM") {
    hour24 += 12;
  }
  return hour24 * 60 + minutes;
}
