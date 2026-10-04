import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental terms | GCMotors Workshop",
  description: "Terms for renting a vehicle from GCMotors Workshop in Gold Coast.",
  alternates: { canonical: "https://gcmotors-workshop.com/rental-terms" },
};

export default function RentalTermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-4">
        <h1 className="text-3xl font-bold">Rental terms</h1>
        <ul className="list-disc pl-5 space-y-1">
          <li><b>Licence:</b> a valid driver licence, or an International Driving Permit (IDP) where required. Minimum age 21.</li>
          <li><b>Bond:</b> a refundable security deposit applies and is returned after the vehicle is checked in.</li>
          <li><b>Kilometres, insurance and excess:</b> stated on your booking confirmation before you pay.</li>
          <li><b>Fuel and condition:</b> hand-over and return are recorded with photos, odometer and fuel level.</li>
          <li><b>Fines and tolls:</b> incurred during the rental are the driver&apos;s responsibility.</li>
        </ul>
        <p>Exact rates, bond and coverage are confirmed in writing when your booking is agreed.</p>
        <p className="text-sm text-slate-400">Last updated: 4 October 2026. Pending legal review.</p>
        <p><a className="underline text-sm" href="/">← Back to home</a></p>
      </div>
    </div>
  );
}
