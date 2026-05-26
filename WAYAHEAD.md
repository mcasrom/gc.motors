# WAYAHEAD — GC Motors | Gold Coast

## ✅ Completed — Project Live & Functional

### Deployed Features
- [x] Landing page with brand "GC Motors | Gold Coast"
- [x] Three business lines: Repair, Rental, Used Cars
- [x] AI chatbot with fallback
- [x] Booking form with vehicle info (make, model, year, plate)
- [x] Service catalog (15 services with prices & duration)
- [x] Rental booking flow — select car, duration, scroll to form
- [x] Admin dashboard (5 tabs: Agenda, Taller, Flota, Venta, Clientes)
- [x] Fleet management CRUD with image upload
- [x] Sales/Used Cars CRUD with image upload
- [x] Jobs/Work orders management with mechanic assignment
- [x] Customer history lookup by phone
- [x] Data persistence via JSON files in `data/`
- [x] Image upload to `public/uploads/` served by nginx
- [x] Uptime monitoring via Uptime Kuma (6 monitors)
- [x] SSL via Let's Encrypt + Cloudflare proxy
- [x] logo.png as favicon, OG image, fallback thumbnail
- [x] SEO metadata + keywords
- [x] Deployed to Hetzner (https://gc.motors.viajeinteligencia.com)
- [x] GitHub repo: https://github.com/mcasrom/gc.motors

### Tech Stack
- **Frontend**: Next.js 16, Tailwind CSS v4, TypeScript
- **Hosting**: Hetzner VPS, PM2, nginx reverse proxy
- **Monitoring**: Uptime Kuma (Docker, network host)
- **Images**: Upload to filesystem, served by nginx `alias`

### Target Audience
- International students (South America, Europe, Asia)
- Backpackers & temporary workers
- Local residents

### Admin Access
- URL: `https://gc.motors.viajeinteligencia.com/admin`
- PIN: `2026`

### Future Ideas (not planned)
- Supabase database migration
- Email/WhatsApp notifications
- Spanish/Portuguese landing pages
- Mobile app
- Real-time vehicle availability
