"use client";

import { useState } from "react";

type Slot = {
  id: string;
  startAt: Date;
  endAt: Date;
  status: string;
};

export default function BookingClient({
  slots,
}: {
  serviceId: string;
  slots: Slot[];
}) {
  const [slotId, setSlotId] = useState(slots[0]?.id || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function reservar() {
    setMsg(null);
    if (!slotId || !name || !email) {
      setMsg("Completa slot, nombre y email.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, name, email, notes }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setMsg(`Error: ${data.error || r.status}`);
        return;
      }

      setMsg(`Reserva creada ✅ (id: ${data.bookingId})`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="font-medium">Selecciona un slot</div>
        <select
          className="w-full rounded-md border bg-transparent p-2"
          value={slotId}
          onChange={(e) => setSlotId(e.target.value)}
        >
          {slots.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.startAt).toISOString()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <input
          className="rounded-md border bg-transparent p-2"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-md border bg-transparent p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="rounded-md border bg-transparent p-2"
          placeholder="Notas (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        className="rounded-md border px-4 py-2 disabled:opacity-60"
        disabled={loading}
        onClick={reservar}
      >
        {loading ? "Reservando..." : "Reservar"}
      </button>

      {msg && <div className="text-sm opacity-90">{msg}</div>}
    </section>
  );
}
