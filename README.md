# Fix & Rent Gold Coast - Project Documentation

## Overview

Smart car repair + rental business in Unit 3G, 31 Rudman Parade, Gold Coast QLD, Australia. AI-powered diagnosis, online booking, 20+ vehicle fleet.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15 / Tailwind CSS |
| Backend | Next.js API Routes |
| AI | OpenAI API / Fallback rules |
| Deployment | Vercel |
| Hosting | vercel.app |

## Project Structure

```
src/app/
├── page.tsx          # Landing page (all in one)
├── layout.tsx         # Root layout + SEO metadata
├── globals.css        # Global styles
└── api/chat/
    └── route.ts      # AI Chatbot endpoint
```

## Features

- [x] Landing page with hero, services, fleet
- [x] AI chatbot for diagnosis
- [x] Booking system (form)
- [x] FAQs accordion
- [x] Testimonials
- [x] SEO local (Gold Coast)
- [x] Fully responsive
- [ ] Database integration
- [ ] Email notifications
- [ ] CRM

## SEO Keywords

- car repair Gold Coast
- car rental Gold Coast
- cheap car hire Gold Coast
- mechanic Gold Coast
- auto repair

## Deployment

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
vercel --prod
```

## Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

## Contact

- Phone: +61 481 268 633
- Email: info@gcmotors-workshop.com
- Address: Unit 3G, 31 Rudman Parade, Gold Coast QLD, Australia

## License

MIT