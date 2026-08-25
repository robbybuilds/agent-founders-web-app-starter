"use client";

import { useState } from "react";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";

import { getPublicEnv } from "@/lib/env";

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new ConvexReactClient(getPublicEnv().convexUrl));

  return <ConvexAuthNextjsProvider client={client}>{children}</ConvexAuthNextjsProvider>;
}
