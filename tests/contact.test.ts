import { expect, test, type Page } from "@playwright/test";

async function fillValid(page: Page) {
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Brief").fill("A launch site for an analytical engine, with motion and a design system.");
}

for (const javaScriptEnabled of [true, false]) {
  test.describe(javaScriptEnabled ? "enhanced" : "without JavaScript", () => {
    test.use({ javaScriptEnabled });

    test("validates on the server and returns a composed message", async ({ page }) => {
      await page.goto("/contact");
      const submit = page.getByRole("button", { name: /Prepare message/ });

      await submit.press("Enter");
      await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
      if (javaScriptEnabled) await expect(page.getByLabel("Name")).toBeFocused();

      await fillValid(page);
      await page.getByRole("button", { name: /Prepare message/ }).press("Enter");

      const open = page.getByRole("link", { name: /Open in mail app/ });
      await expect(open).toBeVisible();
      const href = await open.getAttribute("href");
      expect(href).toMatch(/^mailto:studio@mk1\.dev\?/);
      expect(decodeURIComponent(href ?? "")).toContain("Ada Lovelace");
      await expect(page.getByText(/Nothing has been sent yet/)).toBeVisible();
    });
  });
}
