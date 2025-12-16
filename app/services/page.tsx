import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Servicios</h1>

      <div className="space-y-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.id}`}
            className="block rounded-xl border p-4 hover:bg-white/5"
          >
            <div className="font-medium">{s.name}</div>
            {s.description && <div className="text-sm opacity-80">{s.description}</div>}
          </Link>
        ))}
      </div>
    </main>
  );
}
