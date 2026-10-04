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
  metadataBase: new URL("https://gcmotors-workshop.com"),
  title: "GCMotors Workshop | Gold Coast - Mobile Pre-Purchase Inspections, Rentals & Repairs",
  description: "Mobile pre-purchase inspections, car rentals and vehicle diagnostics & repairs in Gold Coast. Student-friendly pricing, log book services. Trusted by international students and backpackers.",
  keywords: [
    "mobile pre-purchase inspection Gold Coast", "car rental Gold Coast", "vehicle diagnostics Gold Coast",
    "car repair Gold Coast", "cheap mechanic Gold Coast", "student car rental", "backpacker cars",
    "log book service Gold Coast", "pre-purchase inspection", "cheap car hire Gold Coast",
  ],
  openGraph: {
    title: "GCMotors Workshop | Gold Coast - Mobile Inspections, Rentals & Repairs",
    description: "Mobile pre-purchase inspections, car rentals and diagnostics & repairs in Gold Coast, for students, backpackers and locals.",
    url: "https://gcmotors-workshop.com",
    siteName: "GCMotors Workshop",
    type: "website",
    locale: "en_AU",
    images: [{ url: "/logo.png", width: 771, height: 1024, alt: "GCMotors Workshop Gold Coast" }],
  },
  alternates: { canonical: "https://gcmotors-workshop.com" },
  twitter: {
    card: "summary_large_image",
    title: "GCMotors Workshop | Gold Coast",
    description: "Mobile pre-purchase inspections, car rentals and diagnostics & repairs in Gold Coast.",
    images: ["/logo.png"],
  },
  category: "Automotive",
  other: { "geo.region": "AU-QLD", "geo.placename": "Gold Coast" },
  robots: { index: true, follow: true },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "AutoRental"],
  "name": "GCMotors Workshop",
  "url": "https://gcmotors-workshop.com",
  "image": "https://gcmotors-workshop.com/logo.png",
  "telephone": "+61 481 268 633",
  "email": "info@gcmotors-workshop.com",
  "priceRange": "$$",
  "currenciesAccepted": "AUD",
  "paymentAccepted": "Cash, Card",
  "knowsLanguage": ["en", "es", "pt"],
  "description": "Mobile pre-purchase inspections, car rentals and vehicle diagnostics & repairs in Gold Coast.",
  "address": {"@type": "PostalAddress", "streetAddress": "Unit 3G, 31 Rudman Parade", "addressLocality": "Gold Coast", "addressRegion": "QLD", "addressCountry": "AU"},
  "areaServed": {"@type": "Place", "name": "Gold Coast"},
  "makesOffer": [
    {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Mobile pre-purchase inspection"}},
    {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Car rental"}},
    {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Vehicle diagnostics and repairs"}},
    {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Log book service"}}
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-xl focus:shadow-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
