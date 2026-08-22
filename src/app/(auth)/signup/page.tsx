import { signUp } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return <AuthForm action={signUp} mode="signup" />;
}

