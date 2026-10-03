/**
 * Seed script — mirrors the local demo content into Postgres.
 *
 * Run once the DB is provisioned:
 *   npm i -D prisma tsx && npm i @prisma/client
 *   npx prisma migrate dev --name init
 *   npx tsx prisma/seed.ts
 *
 * It reads the same source-of-truth arrays the demo UI uses, so there is a
 * single content definition. Expand lib/data/questions.ts toward 1000+ and
 * this seeds them all.
 */

// NOTE: Uncomment the Prisma import once @prisma/client is installed.
// import { PrismaClient, QCategory, QType, Difficulty, VehicleCode } from "@prisma/client";
import { QUESTIONS } from "../lib/data/questions";
import { ROOMS } from "../lib/data/rooms";
import { PATHS } from "../lib/data/paths";
import { SIGNS } from "../lib/data/signs";
import { BADGES } from "../lib/data/badges";

async function main() {
  console.log("K53 Academy seed — content summary:");
  console.log(`  Paths:     ${PATHS.length}`);
  console.log(`  Rooms:     ${ROOMS.length}`);
  console.log(`  Questions: ${QUESTIONS.length}`);
  console.log(`  Signs:     ${SIGNS.length}`);
  console.log(`  Badges:    ${BADGES.length}`);

  // const prisma = new PrismaClient();
  // await prisma.badge.createMany({ data: BADGES.map(b => ({
  //   slug: b.id, name: b.name, description: b.description, icon: b.icon, accent: b.accent,
  // })), skipDuplicates: true });
  // ...seed signs, paths, rooms, questions similarly...
  // await prisma.$disconnect();

  console.log("\nDemo mode: content is served from lib/data/* at runtime.");
  console.log("Uncomment the Prisma calls above after `prisma migrate` to persist it.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
