import { prisma } from "@/lib/prisma";
import BookingClient from "./booking-client";

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: {
      slots: {
        where: { status: "AVAILABLE" },
        orderBy: { startAt: "asc" },
        take: 20,
      },
    },
  });

  if (!service) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-semibold">Servicio no encontrado</h1>
      </main>
    );
  }

  const slots = service.slots.map((s) => ({
    id: s.id,
    startAt: s.startAt.toISOString(),
    endAt: s.endAt.toISOString(),
    status: s.status,
  }));

  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{service.name}</h1>
        {service.description && <div className="opacity-80">{service.description}</div>}
      </div>

      <BookingClient serviceId={service.id} slots={slots} />
    </main>
  );
}
