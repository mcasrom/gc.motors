import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service | GCMotors Workshop",
  description: "Terms for using the GCMotors Workshop website and booking services.",
  alternates: { canonical: "https://gcmotors-workshop.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-4">
        <h1 className="text-3xl font-bold">Terms of service</h1>
        <p>These terms cover the use of the GCMotors Workshop website and the booking of inspections, diagnostics, repairs and rentals.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A web booking is a <b>request</b>: it becomes confirmed once we contact you and agree the date, price and scope.</li>
          <li>Any additional work is only carried out with your prior approval.</li>
          <li>Estimates are indicative; the final invoice reflects the agreed work, parts and labour.</li>
          <li>Prices are in Australian dollars (AUD) and include GST where applicable.</li>
        </ul>
        <p>Rentals are also subject to the <a className="underline" href="/rental-terms">rental terms</a>.</p>
        <p className="text-sm text-slate-400">Last updated: 4 October 2026. Pending legal review.</p>
        <p><a className="underline text-sm" href="/">← Back to home</a></p>
      </div>
    </div>
  );
}
