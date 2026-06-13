import { format, isValid, parseISO } from "date-fns";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isStrictDateOnly(value: string): boolean {
  if (!dateOnlyPattern.test(value)) {
    return false;
  }

  const parsed = parseISO(value);

  return isValid(parsed) && format(parsed, "yyyy-MM-dd") === value;
}
