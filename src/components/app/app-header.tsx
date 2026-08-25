import { FolderKanban, Settings } from "lucide-react";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  email: string;
};

export function AppHeader({ email }: AppHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link href="/dashboard" className="mr-auto font-semibold">
          Project Desk
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <Button render={<Link href="/projects" />} variant="ghost" size="sm">
            <FolderKanban data-icon="inline-start" />
            <span className="hidden sm:inline">Projects</span>
          </Button>
          <Button render={<Link href="/settings" />} variant="ghost" size="sm">
            <Settings data-icon="inline-start" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </nav>

        <span className="hidden max-w-48 truncate text-xs text-muted-foreground md:block">
          {email}
        </span>
        <SignOutButton />
      </div>
    </header>
  );
}
