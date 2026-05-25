# AGENTS.md — GC Auto | Gold Coast

## Project
- **Name**: GC Auto | Gold Coast
- **Stack**: Next.js 16, Tailwind CSS v4, TypeScript
- **Hosting**: Hetzner (https://gc.motors.viajeinteligencia.com)
- **AI**: OpenAI API (optional, fallback built-in)
- **Logo**: `GC_logo.png` (JPEG, 771x1024) en `/public/`

## Three Business Lines
1. **Repair** — Oil change, brakes, diagnostics, roadworthy, pre-purchase inspections
2. **Rental** — Fleet of reliable cars, weekly/monthly discounts, student-friendly
3. **Used Cars** — Inspected vehicles under $10K, first-car guidance

## Target Audience
- International students (South America — Colombia, Argentina, Chile, Brazil)
- Backpackers (Europe, Asia)
- Temporary workers (work & holiday visas)
- Local residents

## Brand
- Primary color: `#0f766e` (teal-700)
- Accent: `#d97706` (amber-600)
- Dark: `#1e293b` (slate-800)
- Fonts: Outfit (headings), DM Sans (body)

## Files
- `src/app/page.tsx` — Main landing page
- `src/app/layout.tsx` — Root layout with metadata
- `src/app/globals.css` — Tailwind + theme
- `src/app/api/chat/route.ts` — AI chat endpoint
- `public/GC_logo.png` — Logo & favicon

## Commands
```bash
npm run dev    # Development
npm run build  # Production build
npm run start  # Production server
```

## SEO Keywords (Primary)
- mechanic gold coast
- cheap mechanic gold coast  
- student car rental gold coast
- backpacker cars gold coast
- used cars under 10000 gold coast
- first car australia student

## Important
- All content in English (site), support in English + Spanish + Portuguese
- Logo file is actually JPEG despite .png extension — browsers handle it fine
