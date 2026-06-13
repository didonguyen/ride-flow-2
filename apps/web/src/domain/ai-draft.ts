import { z } from "zod";
import { isStrictDateOnly } from "@/src/domain/dates";
import { err, ok, type Result } from "@/src/lib/result";

const dateSchema = z.string().refine(isStrictDateOnly);
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const nonblankStringSchema = z.string().trim().min(1);

export const itineraryDraftSchema = z.object({
  days: z
    .array(
      z.object({
        date: dateSchema,
        items: z.array(
          z.object({
            startTime: timeSchema,
            durationMinutes: z.number().int().positive(),
            title: nonblankStringSchema,
            suggestedPlaceName: nonblankStringSchema.optional(),
            notes: z.string().default("")
          })
        )
      })
    )
    .min(1)
});

export type ItineraryDraft = z.infer<typeof itineraryDraftSchema>;

export function validateItineraryDraft(
  value: unknown
): Result<ItineraryDraft, "ai_draft_days_required" | "ai_draft_invalid"> {
  const parsed = itineraryDraftSchema.safeParse(value);

  if (parsed.success) {
    return ok(parsed.data) as Result<
      ItineraryDraft,
      "ai_draft_days_required" | "ai_draft_invalid"
    >;
  }

  const hasEmptyDays =
    typeof value === "object" &&
    value !== null &&
    "days" in value &&
    Array.isArray(value.days) &&
    value.days.length === 0;

  if (hasEmptyDays) {
    return err("ai_draft_days_required");
  }

  return err("ai_draft_invalid");
}
