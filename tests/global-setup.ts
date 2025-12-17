import { execSync } from "node:child_process";

async function globalSetup() {
  const url = process.env.DATABASE_URL || "";
  const urlTest = process.env.DATABASE_URL_TEST || "";

  if (!url) {
    throw new Error("DATABASE_URL is missing. Refusing to run destructive test setup.");
  }

  if (!urlTest) {
    throw new Error(
      "DATABASE_URL_TEST is missing. Refusing to reset any database without an explicit test URL."
    );
  }

  // Regla dura: solo permitimos reset si ambas variables apuntan a lo mismo
  if (url !== urlTest) {
    throw new Error(
      "Refusing to reset: DATABASE_URL must match DATABASE_URL_TEST exactly."
    );
  }

  // Bloqueo adicional: nunca en Vercel (paranoia saludable)
  if (process.env.VERCEL) {
    throw new Error("Refusing to run destructive reset in Vercel environment.");
  }

  execSync("npx prisma migrate reset --force", { stdio: "inherit" });
  execSync("npx prisma db seed", { stdio: "inherit" });
}

export default globalSetup;
