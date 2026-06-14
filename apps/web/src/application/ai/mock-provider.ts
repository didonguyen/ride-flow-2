import { addDays, differenceInCalendarDays, formatISO, parseISO } from "date-fns";

import type { ItineraryDraftProvider, ItineraryDraftInput, ItineraryDraftSummary } from "@/src/application/ai/types";
import type { ItineraryDraft } from "@/src/domain/ai-draft";

const PACE_TO_ITEMS: Record<NonNullable<ItineraryDraftInput["pace"]>, number> = {
  slow: 2,
  balanced: 3,
  fast: 4
};

const TITLE_TEMPLATES = [
  "Sunrise walk through {destination}",
  "Local {category} tasting",
  "Old town stroll",
  "Viewpoint and {category} stop",
  "Cultural {category} visit",
  "Hidden {category} gem",
  "Sunset {category} at the pier",
  "Riverside {category} loop"
];

const CATEGORIES = ["food", "culture", "nature", "shopping"] as const;

function pickTemplate(index: number, destination: string, category: string) {
  const template = TITLE_TEMPLATES[index % TITLE_TEMPLATES.length];
  return template
    .replace("{destination}", destination)
    .replace("{category}", category);
}

function pickCategory(seed: number) {
  return CATEGORIES[seed % CATEGORIES.length];
}

function formatDateOnly(value: string) {
  return formatISO(parseISO(value), { representation: "date" });
}

export function createMockItineraryDraftProvider(): ItineraryDraftProvider {
  return {
    async generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraftSummary> {
      const start = parseISO(input.startDate);
      const end = parseISO(input.endDate);
      const days = Math.max(1, differenceInCalendarDays(end, start) + 1);
      const pace = input.pace ?? "balanced";
      const itemCount = PACE_TO_ITEMS[pace];

      const draftDays: ItineraryDraft["days"] = [];

      for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
        const dayDate = formatDateOnly(
          formatISO(addDays(start, dayIndex), { representation: "date" })
        );

        const items: ItineraryDraft["days"][number]["items"] = [];

        for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
          const category = pickCategory(dayIndex + itemIndex);
          const startMinutes = 9 * 60 + itemIndex * 180;
          const startHours = Math.floor(startMinutes / 60)
            .toString()
            .padStart(2, "0");
          const startMin = (startMinutes % 60).toString().padStart(2, "0");
          const title = pickTemplate(dayIndex + itemIndex, input.destination, category);

          items.push({
            startTime: `${startHours}:${startMin}`,
            durationMinutes: 90,
            title,
            notes: `Auto-generated for ${input.destination}.`,
            suggestedPlaceName: `${title} in ${input.destination}`
          });
        }

        draftDays.push({ date: dayDate, items });
      }

      const summary = input.preferencePrompt
        ? `${days}-day ${pace} itinerary for ${input.destination}. Focus: ${input.preferencePrompt}.`
        : `${days}-day ${pace} itinerary for ${input.destination}.`;

      return { summary, draft: { days: draftDays } };
    }
  };
}
