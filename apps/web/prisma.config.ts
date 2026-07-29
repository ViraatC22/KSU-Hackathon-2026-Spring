import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma loads this file during client generation, which should not require
    // access to a real database. Runtime and migration commands can override it.
    url: process.env["DATABASE_URL"] ?? "postgresql://ndalama:ndalama@localhost:5432/ndalama",
  },
});
