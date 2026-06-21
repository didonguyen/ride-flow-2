import { err, ok, type Result } from "@/src/lib/result";

export type MemoryDraft = {
  content: string;
  imageCount: number;
  title: string;
};

export type ValidMemoryDraft = {
  content: string;
  imageCount: number;
  title: string;
};

export type MemoryDraftError = "memory_empty";

export function validateMemoryDraft(
  draft: MemoryDraft
): Result<ValidMemoryDraft, MemoryDraftError> {
  const title = draft.title.trim();
  const content = draft.content.trim();
  const imageCount = Math.max(0, Math.floor(draft.imageCount));

  if (!title && !content && imageCount === 0) {
    return err("memory_empty");
  }

  return ok({ title, content, imageCount });
}
