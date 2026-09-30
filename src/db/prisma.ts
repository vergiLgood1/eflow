import { env } from "@/shared/lib/env";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../prisma/generated";

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
});

export const db = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
