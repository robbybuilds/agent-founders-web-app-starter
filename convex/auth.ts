import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import type { DataModel } from "./_generated/dataModel";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";

export function validatePassword(password: string) {
  if (password.length < 8 || password.length > 72) {
    throw new ConvexError("Use a password between 8 and 72 characters.");
  }
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      reset: ResendOTPPasswordReset,
      profile(params) {
        const email = String(params.email ?? "")
          .trim()
          .toLowerCase();
        const name = String(params.name ?? "").trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new ConvexError("Enter a valid email address.");
        }

        if (params.flow === "signUp" && (name.length < 2 || name.length > 80)) {
          throw new ConvexError("Enter a name between 2 and 80 characters.");
        }

        return name ? { email, name } : { email };
      },
      validatePasswordRequirements: validatePassword,
    }),
  ],
});
