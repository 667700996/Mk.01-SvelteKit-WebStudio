import { expect, test } from "@playwright/test";
import { routes } from "./routes";

test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const route of routes) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(message.text());
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "no horizontal scroll").toBeLessThanOrEqual(0);

    expect(problems).toEqual([]);
  });
}

test("unknown routes render the 404 page", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not found");
});

test("feeds and sitemap are well-formed", async ({ request }) => {
  for (const path of ["/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toMatch(/^<\?xml/);
  }
  const index = await request.get("/search.json");
  const entries = await index.json();
  expect(entries.length).toBeGreaterThan(15);
});
