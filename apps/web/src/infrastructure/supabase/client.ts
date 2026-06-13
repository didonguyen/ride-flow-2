import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/src/infrastructure/supabase/database.types";
import { getPublicEnv } from "@/src/lib/env";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
