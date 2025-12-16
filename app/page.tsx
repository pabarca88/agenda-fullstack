import { prisma } from "@/lib/prisma";

export default async function Home() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: { slots: { orderBy: { startAt: "asc" }, take: 5 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Agenda (demo)</h1>

      {services.length === 0 ? (
        <p>No hay servicios.</p>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div key={s.id} className="rounded-xl border p-4">
              <div className="font-medium">{s.name}</div>
              {s.description && <div className="text-sm opacity-80">{s.description}</div>}

              <div className="mt-3 text-sm">
                <div className="font-medium mb-1">Próximos slots:</div>
                <ul className="list-disc pl-5">
                  {s.slots.map((slot) => (
                    <li key={slot.id}>
                      {slot.startAt.toISOString()} — {slot.status}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
