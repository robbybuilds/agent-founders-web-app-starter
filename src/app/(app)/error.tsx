"use client";

import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-lg py-12">
      <h1 className="text-xl font-semibold">Something did not load</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your data has not been changed. Try the request again.
      </p>
      <Button className="mt-5" onClick={reset}>Try again</Button>
    </div>
  );
}

