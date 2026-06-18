const DEFAULT_AUTH_REDIRECT = "/trips";

export function normalizeAuthRedirect(next: string | null): string {
  if (!next) {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return next;
}
