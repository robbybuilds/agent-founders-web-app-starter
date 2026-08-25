import { AuthForm } from "@/components/auth/auth-form";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <AuthForm mode="update" resetEmail={email} />;
}
