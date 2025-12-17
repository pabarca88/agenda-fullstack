import { execSync } from "node:child_process";

async function globalSetup() {
  // Esto resetea la DB apuntada por DATABASE_URL
  execSync("npx prisma migrate reset --force", { stdio: "inherit" });
  execSync("npx prisma db seed", { stdio: "inherit" });
}

export default globalSetup;
