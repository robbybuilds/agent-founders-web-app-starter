import { cache } from "react";
import { redirect } from "next/navigation";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "@convex/_generated/api";

export const getCurrentUser = cache(async () => {
  const token = await convexAuthNextjsToken();

  if (!token) {
    return null;
  }

  try {
    return await fetchQuery(api.users.viewer, {}, { token });
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
