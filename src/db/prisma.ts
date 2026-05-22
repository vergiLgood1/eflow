import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";
import { PrismaClient } from "../../prisma/generated";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const db = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
