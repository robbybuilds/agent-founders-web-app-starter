export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 px-5 py-12">
      {children}
    </main>
  );
}

