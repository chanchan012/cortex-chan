import { expect, test } from "@playwright/test";

for (const route of ["/", "/sign-in", "/sign-up", "/?demo=1"]) {
  test(`${route} fits the dynamic viewport`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", {level:1})).toBeVisible();
    const fits = await page.evaluate(() => {
      const root = document.documentElement;
      const shell = document.querySelector(".screen")!.getBoundingClientRect();
      return root.scrollWidth === root.clientWidth && root.scrollHeight === innerHeight &&
        shell.height === innerHeight && [...document.querySelectorAll("main a,main button,footer")].every((element) => {
          const rect = element.getBoundingClientRect();
          return rect.height && rect.top >= 0 && rect.left >= 0 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1;
        });
    });
    expect(fits).toBe(true);
  });
}
test("guest can enter, inspect an API service, change profile, and pause packet flow", async ({page}) => {
  await page.goto("/sign-in");
  await page.getByRole("link", {name:"Continue as guest"}).click();
  await expect(page).toHaveURL(/demo=1/);
  await page.getByRole("button", {name:"Inspect API service"}).click();
  await expect(page.getByText("Serves requests using the cache and database.")).toBeVisible();
  await page.getByRole("button", {name:/Steady ×1/}).click();
  await expect(page.getByText("3,600")).toBeVisible();
  await page.getByRole("button", {name:"Pause packets"}).click();
  await expect(page.getByRole("button", {name:"Play packets"})).toBeVisible();
});
test("Next routes anonymous requests to Hono", async ({request}) => {
  expect(await (await request.get("/api/session")).json()).toEqual({mode:"guest"});
  expect((await request.get("/api/account")).status()).toBe(401);
});
