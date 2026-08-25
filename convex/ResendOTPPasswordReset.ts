import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

function randomCode() {
  const digits = new Uint8Array(8);
  crypto.getRandomValues(digits);
  return Array.from(digits, (value) => value % 10).join("");
}

// Sends the 8-digit code a user types on the update-password page.
// It needs AUTH_RESEND_KEY set on your Convex deployment. See docs/01-setup.md.
export const ResendOTPPasswordReset = Email({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15,
  async generateVerificationToken() {
    return randomCode();
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL ?? "Project Desk <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your Project Desk password",
      text: `Your password reset code is ${token}. It expires in 15 minutes. If you did not ask for this, you can ignore this email.`,
    });

    if (error) {
      throw new Error("Could not send the password reset email.");
    }
  },
});
