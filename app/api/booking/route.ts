import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Body = {
  slotId: string;
  name: string;
  email: string;
  notes?: string;
};

export async function POST(req: Request) {
  let body: Body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slotId = (body.slotId || "").trim();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const notes = (body.notes || "").trim();

  if (!slotId || !name || !email) {
    return NextResponse.json({ error: "slotId, name, email are required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        select: { id: true, status: true },
      });

      if (!slot) return { ok: false as const, code: "NOT_FOUND" as const };
      if (slot.status !== "AVAILABLE") return { ok: false as const, code: "NOT_AVAILABLE" as const };

      // Reserva (Booking.slotId es UNIQUE, así que si alguien gana la carrera, el otro falla)
      const booking = await tx.booking.create({
        data: { slotId, name, email, notes: notes || null },
      });

      await tx.slot.update({
        where: { id: slotId },
        data: { status: "RESERVED" },
      });

      return { ok: true as const, bookingId: booking.id };
    });

    if (!result.ok) {
      const status = result.code === "NOT_FOUND" ? 404 : 409;
      return NextResponse.json({ error: result.code }, { status });
    }

    return NextResponse.json({ ok: true, bookingId: result.bookingId }, { status: 201 });
  } catch (e: any) {
    // si chocó por UNIQUE (doble reserva), lo tratamos como conflicto
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 });
  }
}
