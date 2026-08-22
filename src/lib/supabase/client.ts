"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient() {
  const environment = getPublicEnv();

  return createBrowserClient<Database>(
    environment.supabaseUrl,
    environment.supabasePublishableKey,
  );
}

