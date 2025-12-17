# Agenda Fullstack (Next.js + Postgres + Prisma)

Demo: https://agenda-fullstack.vercel.app

[![E2E (Playwright)](https://github.com/pabarca88/agenda-fullstack/actions/workflows/e2e.yml/badge.svg)](https://github.com/pabarca88/agenda-fullstack/actions/workflows/e2e.yml)

## Features
- Listado de servicios
- Detalle de servicio con slots disponibles
- Reserva de slot (server-side) con control de concurrencia
- Confirmación de reserva `/bookings/[id]`

## Stack
- Next.js (App Router) + TypeScript
- Postgres (Neon)
- Prisma ORM
- Deploy: Vercel

## Key technical decisions
- Server Components for data fetching (SSR)
- Prisma transaction to prevent double booking (one wins, one gets 409)
- Unique constraints in DB: one booking per slot

## Testing (E2E)
- `npm run test:e2e`
- Includes concurrency test: two clients attempt the same slot; one succeeds (redirect to `/bookings/:id`) and the other gets a 409-like UI error.


## Local setup
```bash
npm i
# set DATABASE_URL in .env
npx prisma migrate dev
npx prisma db seed
npm run dev
