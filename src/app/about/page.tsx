import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | GC Auto Gold Coast",
  description: "Auto repair, car rental & used cars in Gold Coast. Family-run, student-friendly, fair prices.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Image src="/logo.png" alt="GC Auto" width={100} height={76} className="mb-8 object-contain" />
        <h1 className="text-3xl font-bold mb-6">About GC Auto</h1>
        <div className="prose prose-slate max-w-none space-y-4">
          <p>
            GC Auto is a family-run auto hub based in Gold Coast, Queensland. We help students,
            backpackers and locals with car repairs, rentals and used cars — without the usual
            workshop markup or hidden fees.
          </p>
          <p>
            What started as helping international friends with their car problems grew into a
            full-service workshop. We speak Spanish, Portuguese and English, and we know what
            it&apos;s like to arrive in Australia and need a reliable car without breaking the bank.
          </p>
          <p>
            Every repair comes with a free AI diagnosis, transparent pricing at $120 AUD/hour labor,
            and a free loan car while yours is being fixed.
          </p>
          <p className="text-sm text-slate-400 pt-4">
            📍 Gold Coast, Queensland, Australia<br />
            📞 +61 7 1234 5678 · ✉️ info@gcauto.com.au
          </p>
        </div>
      </div>
    </div>
  );
}
