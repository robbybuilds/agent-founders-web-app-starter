import { AppHeader } from "@/components/app/app-header";
import { requireUser } from "@/lib/auth/user";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader email={user.email ?? "Signed in"} />
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-10">{children}</main>
    </div>
  );
}

