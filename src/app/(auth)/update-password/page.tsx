import { updatePassword } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { requireUser } from "@/lib/auth/user";

export default async function UpdatePasswordPage() {
  await requireUser();
  return <AuthForm action={updatePassword} mode="update" />;
}

