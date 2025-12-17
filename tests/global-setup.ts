import { execSync } from "node:child_process";

async function globalSetup() {
  const url = process.env.DATABASE_URL || "";

  // 1) No corras si no hay DB
  if (!url) {
    throw new Error("DATABASE_URL is missing. Refusing to run destructive test setup.");
  }

  // 2) Bloqueo por nombre de branch/db (ajústalo si quieres)
  // Neon production branch suele llamarse "production" (en tu caso) y NO debe resetearse.
  const looksLikeProd =
    url.includes("production") ||
    url.includes("vercel") ||
    url.includes("prod");

  if (looksLikeProd) {
    throw new Error(
      `Refusing to reset a database that looks like production. DATABASE_URL contains a prod-like token.`
    );
  }

  // 3) Recomendado: exige que sea DB/branch de tests (más seguro)
  const mustContain = ["test", "ci", "e2e"];
  const isClearlyTest = mustContain.some((t) => url.toLowerCase().includes(t));

  if (!isClearlyTest) {
    throw new Error(
      `Refusing to reset DATABASE_URL because it doesn't look like a test DB. Add 'test'/'ci'/'e2e' in the Neon branch name or connection string.`
    );
  }

  execSync("npx prisma migrate reset --force", { stdio: "inherit" });
  execSync("npx prisma db seed", { stdio: "inherit" });
}

export default globalSetup;
