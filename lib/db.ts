/**
 * Prisma client singleton — the production data layer.
 *
 * This session ships a demo build that runs entirely on local content
 * (lib/data/*) plus a persisted Zustand store (lib/store.ts), so the app
 * runs with zero backend. To go live:
 *
 *   1. Provision a Supabase Postgres DB and set DATABASE_URL / DIRECT_URL.
 *   2. `npm i prisma @prisma/client && npx prisma migrate dev`
 *   3. Uncomment the client below and swap the store's writes for API routes
 *      that call these models (see prisma/schema.prisma).
 */

// import { PrismaClient } from "@prisma/client";
//
// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
//
// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({ log: ["error", "warn"] });
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const DB_READY = false;
