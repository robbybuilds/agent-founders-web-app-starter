import { ArrowRight, CheckCircle2, FolderKanban, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <span className="font-semibold">Project Desk</span>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Sign in
            </Link>
            <Link href="/signup" className={buttonVariants({ size: "sm" })}>
              Create account
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-sm font-medium text-muted-foreground">A simple project workspace</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Project Desk
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Keep the problem, what you are building, and its current status in one place. Your projects stay private to your account.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Start a project
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <h2 className="text-xl font-semibold">The useful parts are already here</h2>
            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <FolderKanban className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">One clear project record</p>
                  <p className="mt-1 text-sm text-muted-foreground">Name it, describe it, and move it from idea to launched.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Private by default</p>
                  <p className="mt-1 text-sm text-muted-foreground">Database rules keep each account inside its own records.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Built for a real release</p>
                  <p className="mt-1 text-sm text-muted-foreground">Authentication, validation, tests, and deployment checks are part of the starter.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-xs text-muted-foreground">PROJECT</p>
                <p className="mt-1 font-semibold">First useful app</p>
              </div>
              <Badge variant="secondary">Building</Badge>
            </div>
            <dl className="grid gap-5 pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">PROBLEM</dt>
                <dd className="mt-2 text-sm">People lose the decision that should guide the next build session.</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">NEXT STEP</dt>
                <dd className="mt-2 text-sm">Put the first version in front of one real user.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
