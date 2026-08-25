"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Sign out"
      title="Sign out"
      onClick={async () => {
        await signOut();
        router.push("/login");
      }}
    >
      <LogOut />
    </Button>
  );
}
