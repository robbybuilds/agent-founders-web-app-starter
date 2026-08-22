import { PasswordForm, ProfileForm } from "@/components/settings/settings-forms";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-muted-foreground">Account</p>
      <h1 className="mt-1 text-2xl font-semibold">Settings</h1>

      <section className="mt-10" aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="text-base font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        <div className="mt-5">
          <ProfileForm
            displayName={profile?.display_name ?? String(user.user_metadata.display_name ?? "")}
          />
        </div>
      </section>

      <Separator className="my-10" />

      <section aria-labelledby="password-heading">
        <h2 id="password-heading" className="text-base font-semibold">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Changing your password keeps your current session active.
        </p>
        <div className="mt-5">
          <PasswordForm />
        </div>
      </section>
    </div>
  );
}
