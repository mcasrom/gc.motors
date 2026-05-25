import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gc.motors.viajeinteligencia.com"),
  title: "GC Auto | Gold Coast - Car Repair, Rental & Used Cars",
  description: "Auto repair, car rental & used cars in Gold Coast. AI diagnosis, student-friendly pricing, roadworthy certificates, pre-purchase inspections. Trusted by international students and backpackers.",
  keywords: [
    "car repair Gold Coast", "car rental Gold Coast", "used cars Gold Coast",
    "cheap mechanic Gold Coast", "student car rental", "backpacker cars",
    "roadworthy certificate Gold Coast", "pre-purchase inspection",
    "first car Australia", "cheap car hire Gold Coast",
  ],
  openGraph: {
    title: "GC Auto | Gold Coast - Auto Repair, Rental & Used Cars",
    description: "Your trusted auto hub in Gold Coast. Repairs, rentals and used cars for students, backpackers and locals.",
    type: "website",
    locale: "en_AU",
    images: [{ url: "/GC_logo.png", width: 771, height: 1024, alt: "GC Auto Gold Coast" }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/GC_logo.png", apple: "/GC_logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-full">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-xl focus:shadow-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
