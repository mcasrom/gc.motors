import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | GCMotors Workshop",
  description: "How GCMotors Workshop handles the personal information you submit through the website.",
  alternates: { canonical: "https://gcmotors-workshop.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-4">
        <h1 className="text-3xl font-bold">Privacy policy</h1>
        <p>GCMotors Workshop collects the information you submit in the booking form —name, phone, email and vehicle details— only to manage your booking and contact you about it.</p>
        <p>We do not sell your data. We share it only with the service providers strictly needed to run the business (for example, email delivery) and store it on our own server.</p>
        <p>You can ask us to access, correct or delete your data at any time by writing to <a className="underline" href="mailto:info@gcmotors-workshop.com">info@gcmotors-workshop.com</a>.</p>
        <p className="text-sm text-slate-400">Last updated: 4 October 2026. Pending review for compliance with the Australian Privacy Act.</p>
        <p><a className="underline text-sm" href="/">← Back to home</a></p>
      </div>
    </div>
  );
}
