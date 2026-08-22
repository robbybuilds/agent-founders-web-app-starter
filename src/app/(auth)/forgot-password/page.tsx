import { requestPasswordReset } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  return <AuthForm action={requestPasswordReset} mode="forgot" />;
}

