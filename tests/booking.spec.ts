import { test, expect } from "@playwright/test";

test("puedo reservar un slot y ver confirmación", async ({ page }) => {
  await page.goto("/services");

  await page.getByText("Consulta General").click();

  const select = page.locator("select");
  const firstOptionText = await select.locator("option").first().innerText();

  await page.getByPlaceholder("Nombre").fill("Pablo");
  await page.getByPlaceholder("Email").fill("psat@gmail.com");
  await page.getByRole("button", { name: "Reservar" }).click();

  await expect(page.getByText("Reserva confirmada")).toBeVisible();

  // volver al servicio y verificar que el slot ya no está
  await page.getByRole("link", { name: "Volver al servicio" }).click();
  await expect(select).toBeVisible();
  await expect(select.locator("option", { hasText: firstOptionText })).toHaveCount(0);
});

async function outcome(page: any) {
  const ok = page.waitForURL(/\/bookings\/.+/, { timeout: 4000 }).then(() => "ok");
  const err = page
    .getByText(/Error:\s*(NOT_AVAILABLE|CONFLICT)/)
    .waitFor({ state: "visible", timeout: 4000 })
    .then(() => "err");

  return Promise.race([ok, err]);
}

test("concurrencia: si dos intentan el mismo slot, uno gana y el otro falla", async ({ browser }) => {
  const ctx = await browser.newContext();
  const p1 = await ctx.newPage();
  const p2 = await ctx.newPage();

  await p1.goto("/services/svc-1");
  await p2.goto("/services/svc-1");

  // Ambos seleccionan el MISMO slot (primera opción)
  const slotValue = await p1.locator("select option").first().getAttribute("value");
  if (!slotValue) throw new Error("No slot options found");

  await p1.locator("select").selectOption(slotValue);
  await p2.locator("select").selectOption(slotValue);

  await p1.getByPlaceholder("Nombre").fill("A");
  await p1.getByPlaceholder("Email").fill("a@test.com");
  await p2.getByPlaceholder("Nombre").fill("B");
  await p2.getByPlaceholder("Email").fill("b@test.com");

  // Click simultáneo
  await Promise.all([
    p1.getByRole("button", { name: "Reservar" }).click(),
    p2.getByRole("button", { name: "Reservar" }).click(),
  ]);

  const [o1, o2] = await Promise.all([outcome(p1), outcome(p2)]);

  // Debe haber exactamente 1 ok y 1 err
  expect([o1, o2].sort()).toEqual(["err", "ok"]);
});
