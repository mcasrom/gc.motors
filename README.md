# GCMotors Workshop

Web del taller **GCMotors Workshop** (Gold Coast, QLD, Australia): inspecciones
pre-compra móviles, alquiler de coches y diagnóstico/reparación.

- Producción: <https://gcmotors-workshop.com> (apex canónico; `www` → 301)
- Teléfono: +61 481 268 633 · Email: info@gcmotors-workshop.com
- Dirección: Unit 3G, 31 Rudman Parade, Gold Coast QLD, Australia
- Idiomas: inglés · español · portugués

## Stack
- **Next.js 16** (App Router) + **React 19** + **Tailwind 4**
- SSR + **API routes** (chat IA, reservas, trabajos de taller, flota, ventas, subida de imágenes, cliente)
- **Autoalojado** (Hetzner): PM2 `gcmotors` en el puerto `3019`, nginx + Cloudflare
- **Sin base de datos**: ficheros `data/*.json` y subidas en `public/uploads/`

## Estructura
```
src/app/
├── page.tsx              # Landing (una sola página)
├── layout.tsx            # Metadatos SEO + JSON-LD (AutoRepair/AutoRental)
├── admin/page.tsx        # Panel de administración (PIN)
├── about/ privacy/ terms/ rental-terms/
└── api/
    ├── chat/             # Asistente (OpenAI o motor de reglas)
    ├── book/ jobs/       # Reservas y órdenes de taller
    ├── fleet/ sales/     # Alquiler y venta
    ├── services/         # Catálogo de servicios (GET público, PUT admin)
    ├── customer/ upload/ # Ficha de cliente y subida de imágenes
    ├── stats/ track/     # Conversiones web (first-party)
data/                     # Datos en ficheros (ver abajo)
scripts/backup.sh         # Copia de seguridad diaria
```

## Datos (ficheros)
- `data/services.json` — catálogo de servicios y precios (**editable desde /admin**)
- `data/fleet.json` — flota de alquiler
- `data/sales.json` — coches en venta
- `data/bookings.json`, `data/jobs.json` — reservas y trabajo de taller (fuera de git)
- `data/chat.jsonl`, `data/events.jsonl` — logs de chat y de conversiones (runtime)

## Servicios y precios
> "Prices start from" (AUD)

| Servicio | Precio |
|---|---|
| Service (oil + oil filter + check) | $200 |
| Brake pads replacement | $190 |
| Battery Replacement | $200 |
| OBD2 SCAN / Diagnostic | $50 |
| Logbook servicing | $220 |
| Pre purchase Inspection | $120 |
| Clutch Replacement | $900 |
| Timing belt replacement | $550 |
| Transmission service | $360 |
| Roadworthy Certificate RWC | $110 |

## Panel /admin
- Acceso con **PIN** validado en servidor (`GC_ADMIN_PIN`).
- Pestañas: **Agenda**, **Taller**, **Flota**, **Servicios**, **Venta**, **Clientes**, **Web**.
- **Servicios**: editar nombre, precio y duración; añadir/eliminar. Guarda en
  `data/services.json` (vía `PUT /api/services`, con `Bearer`) y **la web se
  actualiza al instante** (sin build).

## Asistente IA
- Por defecto funciona con un **motor de reglas local** (sin coste).
- Para IA real: define `OPENAI_API_KEY` y reinicia (`pm2 restart gcmotors`).

## Email
- **Resend** (dominio verificado). Cada reserva avisa desde
  `bookings@gcmotors-workshop.com` a **`rentals@`** (alquiler) o **`repairs@`**
  (servicios/reparación), con `Reply-To` = cliente.
- **Cloudflare Email Routing** reenvía `rentals@` / `repairs@` / `service@` / `info@`
  a la bandeja del propietario.

## Desarrollo
```bash
npm install
npm run dev
```

## Despliegue (autoalojado)
```bash
git pull
npm ci
npm run build
pm2 restart gcmotors
```

## Variables de entorno
Ver `.env.example`: `GC_ADMIN_PIN`, `CRON_SECRET`, `OPENAI_API_KEY` (opcional),
`RESEND_API_KEY`, `RESEND_FROM`, `BOOKING_TO_RENTALS`, `BOOKING_TO_REPAIRS`,
`NEXT_PUBLIC_GOOGLE_REVIEW_URL`.

## Copia de seguridad
`scripts/backup.sh` (cron `12 3 * * *`): empaqueta `data/`, `public/uploads/` y
`.env`; conserva las 14 últimas copias.

## Licencia
**AGPL-3.0** — ver [LICENSE](LICENSE).
