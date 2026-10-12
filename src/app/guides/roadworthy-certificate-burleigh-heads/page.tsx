import type { Metadata } from "next";

const URL = "https://gcmotors-workshop.com/guides/roadworthy-certificate-burleigh-heads";
const WA_RWC =
  "https://wa.me/61481268633?text=" +
  encodeURIComponent("Hi GCMotors! I need an RWC / Safety Certificate inspection in Burleigh Heads. Can you help?");

export const metadata: Metadata = {
  title: "QLD Roadworthy Certificate (RWC) Checklist — Burleigh Heads | GCMotors",
  description:
    "Pass your QLD Safety Certificate inspection first time in Burleigh Heads: 5-point pre-inspection checklist, common RWC myths and re-test rules.",
  keywords: [
    "roadworthy certificate Burleigh Heads",
    "RWC inspection Burleigh Heads",
    "safety certificate Queensland",
    "QLD roadworthy checklist",
    "pre-purchase inspection Gold Coast",
    "mechanic Burleigh Heads",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "How to Pass Your QLD Roadworthy Certificate (RWC) in Burleigh Heads",
    description:
      "5-point pre-inspection checklist, common RWC myths and re-test rules. Pass first time, no surprises.",
    url: URL,
    siteName: "GCMotors Workshop",
    type: "article",
    locale: "en_AU",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "QLD Roadworthy Certificate checklist — GCMotors Workshop Burleigh Heads" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Pass Your QLD Roadworthy Certificate (RWC) in Burleigh Heads",
    description: "5-point pre-inspection checklist + RWC myths. GCMotors Workshop.",
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Pass Your QLD Roadworthy Certificate (RWC) in Burleigh Heads Without Surprises",
      description:
        "Pre-inspection checklist for the Queensland Safety Certificate, common RWC myths and re-inspection rules.",
      image: "https://gcmotors-workshop.com/og.png",
      author: { "@type": "Organization", name: "GCMotors Workshop", url: "https://gcmotors-workshop.com" },
      publisher: { "@type": "Organization", name: "GCMotors Workshop" },
      datePublished: "2026-10-12",
      dateModified: "2026-10-12",
      inLanguage: "en-AU",
      mainEntityOfPage: URL,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does a QLD Roadworthy Certificate guarantee the engine is healthy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. A Roadworthy Certificate is strictly a safety inspection mandated by Queensland Transport (brakes, tyres, lights, rust, steering). It is not a full mechanical evaluation. For peace of mind when buying a used car, get a pre-purchase mechanical inspection.",
          },
        },
        {
          "@type": "Question",
          name: "If my car fails the RWC, do I lose my money and pay for a full test again?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "At GCMotors Workshop, no. If your vehicle fails, you have 14 days (or 500 km) to rectify the defects and return for a re-inspection of those specific items only.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gcmotors-workshop.com/" },
        { "@type": "ListItem", position: 2, name: "Guides", item: "https://gcmotors-workshop.com/#guides" },
        { "@type": "ListItem", position: 3, name: "QLD Roadworthy Certificate (RWC) Checklist" },
      ],
    },
  ],
};

const CHECKLIST = [
  {
    n: "1",
    title: "Tyres & Wheels",
    items: [
      "Tread Depth: minimum legal tread depth is 1.5 mm across the entire tyre.",
      "Condition: no visible cracks, bulges, sidewall damage, or exposed metal threads.",
      "Spare Tyre: must be inflated and in usable condition.",
    ],
  },
  {
    n: "2",
    title: "Brakes & Steering",
    items: [
      "Handbrake: must hold the vehicle firmly on a steep incline.",
      "Brake Response: no squealing, grinding noise, or soft/spongy pedal feel.",
      "Fluid Leaks: no active brake fluid or power steering leaks under the car.",
    ],
  },
  {
    n: "3",
    title: "Lights, Signals & Horn",
    items: [
      "Check every single bulb: headlights (low & high beam), tail lights, brake lights, indicators, hazard lights, and plate lights.",
      "Horn must produce a clear, audible sound.",
    ],
  },
  {
    n: "4",
    title: "Windscreen, Wipers & Mirrors",
    items: [
      "Windscreen: no cracks or chips in the driver's direct line of sight (wiper sweep area).",
      "Wipers: rubber blades must not be split, brittle, or leaving streaks.",
      "Mirrors: side and rear-view mirrors must be intact and fully adjustable.",
    ],
  },
  {
    n: "5",
    title: "Fluid Leaks & Underbody",
    items: [
      "Excessive oil or coolant leaks are an instant fail in QLD.",
      "Exhaust system must be leak-free and firmly secured with no rust holes.",
    ],
  },
];

const SHARE_TEXT = "How to pass your QLD Roadworthy Certificate (RWC) in Burleigh Heads — checklist by @GCMotors";

export default function RwcGuidePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-sm font-semibold tracking-wide text-teal-700 mb-3">
          <a href="/#guides" className="hover:underline">Guides</a> · Burleigh Heads
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          🚗 How to Pass Your QLD Roadworthy Certificate (RWC) in Burleigh Heads Without Surprises
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          Guía técnica: cómo pasar la inspección RWC en Queensland sin sorpresas ni costes ocultos.
        </p>
        <p className="text-sm text-slate-400 mb-8">🇬🇧 English version · Updated October 2026 · 4 min read</p>

        <div className="prose prose-slate max-w-none space-y-4">
          <p>
            Buying or selling a car in Queensland? Transferring registration from interstate? In QLD, a{" "}
            <strong>Roadworthy Certificate (Safety Certificate / RWC)</strong> is legally required.
          </p>
          <p>
            Passing the RWC inspection doesn&apos;t have to be a stressful or expensive nightmare. At{" "}
            <strong>GCMotors Workshop (Burleigh Heads)</strong>, we see dozens of vehicles every week fail
            for simple, preventable issues that could have been fixed in minutes before the inspection.
          </p>
          <p>
            Here is a straightforward checklist to ensure your car passes the QLD Safety Certificate
            inspection on the first attempt without unexpected costs.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-2">🔍 Quick Pre-Inspection Checklist</h2>
        <p className="text-slate-600 mb-6">Save time &amp; money — check these 5 critical areas before bringing your car in:</p>
        <div className="space-y-4">
          {CHECKLIST.map((c) => (
            <div key={c.n} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="font-bold text-xl text-slate-800 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white text-base mr-2">{c.n}</span>
                {c.title}
              </h3>
              <ul className="space-y-2">
                {c.items.map((it, i) => (
                  <li key={i} className="flex gap-2 text-slate-700">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">⚠️ Common Myths About QLD RWC</h2>
        <div className="space-y-3">
          <details className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-medium hover:bg-stone-50">
              “An RWC guarantees the engine is in perfect mechanical health.”
            </summary>
            <div className="px-6 pb-4 text-slate-700">
              <strong>False.</strong> A Roadworthy Certificate is strictly a safety inspection mandated by
              Queensland Transport (brakes, tyres, lights, rust, steering). It is not a full mechanical
              evaluation. For peace of mind when buying a used car, always get a{" "}
              <a href="/#services" className="text-teal-700 underline">pre-purchase mechanical inspection</a>.
            </div>
          </details>
          <details className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-medium hover:bg-stone-50">
              “If my car fails, I lose my money and have to pay for a full test again.”
            </summary>
            <div className="px-6 pb-4 text-slate-700">
              <strong>Not with us.</strong> If your vehicle fails an inspection, you have{" "}
              <strong>14 days (or 500 km)</strong> to rectify the defects and return for a re-inspection
              of those specific items.
            </div>
          </details>
        </div>

        <div className="mt-12 bg-slate-800 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">🛠️ Need an RWC in Burleigh Heads?</h2>
          <p className="text-slate-300 mb-6">
            Safety Certificate inspection, quick pre-check, or mobile pre-purchase evaluation —
            book in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+61481268633" className="bg-white text-slate-900 px-7 py-3 rounded-full font-semibold">
              📞 +61 481 268 633
            </a>
            <a href={WA_RWC} target="_blank" rel="noopener" className="bg-[#25D366] text-white px-7 py-3 rounded-full font-semibold">
              WhatsApp us
            </a>
            <a href="/#contact" className="border border-slate-500 text-white px-7 py-3 rounded-full font-semibold">
              Book Online
            </a>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            📍 Unit 3G, 31 Rudman Parade, Burleigh Heads QLD · 💬 We speak English, Spanish &amp; Portuguese!
          </p>
        </div>

        <div className="mt-10 bg-teal-50 border border-teal-100 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-2">🇪🇸 En español, en resumen</h2>
          <p className="text-slate-700 text-[15px] leading-relaxed">
            Para vender un coche en Queensland (o traerlo de otro estado) necesitas el certificado de
            circulación <strong>RWC</strong>. La mayoría de los suspensos son por cosas simples:
            neumáticos, frenos, luces, limpiaparabrisas y fugas. Revisa los 5 puntos de la lista antes
            de venir y apruebas a la primera. Si suspendes, tienes <strong>14 días o 500 km</strong> para
            arreglarlo y solo repetimos esos puntos. Hablamos español y portugués — escríbenos por{" "}
            <a href={WA_RWC} target="_blank" rel="noopener" className="text-teal-700 underline">WhatsApp</a>.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium mr-1">Share:</span>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(URL)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 font-medium">𝕏 Post</a>
          <a href={`https://bsky.app/intent/compose?text=${encodeURIComponent(SHARE_TEXT + " " + URL)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 font-medium">🦋 Bluesky</a>
          <a href={`https://mastodon.social/share?text=${encodeURIComponent(SHARE_TEXT + " " + URL)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 font-medium">🐘 Mastodon</a>
          <a href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + URL)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 font-medium">💬 WhatsApp</a>
        </div>

        <p className="mt-10 text-sm text-slate-400">
          Related: <a href="/#services" className="underline">Workshop services</a> ·{" "}
          <a href="/#contact" className="underline">Book online</a> ·{" "}
          <a href="/about" className="underline">About GCMotors</a>
        </p>
      </div>
    </div>
  );
}
