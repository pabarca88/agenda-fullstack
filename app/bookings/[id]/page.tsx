import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BookingDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      slot: {
        include: { service: true },
      },
    },
  });

  if (!booking) {
    return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Reserva no encontrada</h1>
        <Link className="underline" href="/services">Volver a servicios</Link>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Reserva confirmada ✅</h1>
        <div className="opacity-80">ID: {booking.id}</div>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <div className="font-medium">{booking.slot.service.name}</div>
        {booking.slot.service.description && (
          <div className="text-sm opacity-80">{booking.slot.service.description}</div>
        )}

        <div className="pt-2 text-sm space-y-1">
          <div>
            <span className="opacity-80">Fecha:</span>{" "}
            {new Date(booking.slot.startAt).toLocaleString("es-CL", {
              timeZone: "America/Santiago",
            })}
          </div>
          <div>
            <span className="opacity-80">Nombre:</span> {booking.name}
          </div>
          <div>
            <span className="opacity-80">Email:</span> {booking.email}
          </div>
          {booking.notes && (
            <div>
              <span className="opacity-80">Notas:</span> {booking.notes}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Link className="underline" href="/services">Reservar otra</Link>
        <Link className="underline" href={`/services/${booking.slot.serviceId}`}>Volver al servicio</Link>
      </div>
    </main>
  );
}
