# Agenda Fullstack (Next.js + Postgres + Prisma)

Demo: https://agenda-fullstack.vercel.app

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

## Local setup
```bash
npm i
# set DATABASE_URL in .env
npx prisma migrate dev
npx prisma db seed
npm run dev
