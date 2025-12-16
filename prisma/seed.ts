import { PrismaClient, Role, SlotStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@demo.cl";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin", role: Role.ADMIN },
  });

  const service = await prisma.service.upsert({
    where: { id: "svc-1" },
    update: {},
    create: {
      id: "svc-1",
      name: "Consulta General",
      description: "Atención estándar",
      durationMin: 30,
      isActive: true,
    },
  });

  // Crea 10 slots a partir de mañana, cada 60 min
  const base = new Date();
  base.setDate(base.getDate() + 1);
  base.setHours(9, 0, 0, 0);

  const slots = [];
  for (let i = 0; i < 10; i++) {
    const startAt = new Date(base.getTime() + i * 60 * 60 * 1000);
    const endAt = new Date(startAt.getTime() + service.durationMin * 60 * 1000);
    slots.push({
      serviceId: service.id,
      startAt,
      endAt,
      status: SlotStatus.AVAILABLE,
    });
  }

  // upsert manual con createMany + skipDuplicates
  await prisma.slot.createMany({ data: slots, skipDuplicates: true });

  console.log("Seed OK:", { admin: admin.email, service: service.name, slots: slots.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
