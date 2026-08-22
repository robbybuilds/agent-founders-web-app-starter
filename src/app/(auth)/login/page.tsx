import { signIn } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { safeRedirectPath } from "@/lib/validation/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return <AuthForm action={signIn} mode="login" nextPath={safeRedirectPath(next)} />;
}

