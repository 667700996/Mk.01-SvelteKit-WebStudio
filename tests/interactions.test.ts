import { expect, test } from "@playwright/test";

test.describe("command palette", () => {
  test.skip(({ isMobile }) => isMobile, "keyboard-driven");

  test("opens with the shortcut, fuzzy-matches, and navigates", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog", { name: "Search and commands" });
    await expect(dialog).toBeVisible();

    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();
    await input.fill("aeth");

    const first = dialog.getByRole("option").first();
    await expect(first).toContainText("Aether");
    await expect(first).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\/atlas-labs$/);
    await expect(dialog).toBeHidden();
  });

  test("closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/work");
    const trigger = page.getByRole("button", { name: "Search the site" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("searches journal entries from the prerendered index", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await page.getByRole("combobox").fill("launch playbook");
    await expect(page.getByRole("option").first()).toContainText("Cinematic Launch Playbook");
  });
});

test("appearance preference persists across reloads", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");

  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();

  await page.getByRole("radio", { name: "Auto" }).check();
  await expect(html).not.toHaveAttribute("data-theme", /.+/);
});

test("mobile menu opens, lists destinations, and closes on navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const menu = page.getByRole("navigation", { name: "Mobile" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Journal" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(menu).toBeHidden();
});

test("engineering tabs follow the ARIA keyboard pattern", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard-driven");
  await page.goto("/");
  const first = page.getByRole("tab", { name: /Architecture/ });
  await first.focus();
  await page.keyboard.press("ArrowDown");
  const second = page.getByRole("tab", { name: /Runtime/ });
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Alive, by design.");
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Quality/ })).toHaveAttribute("aria-selected", "true");
});

test("MDX journal articles render their body", async ({ page }) => {
  await page.goto("/blog/expressive-motion");
  await expect(page.getByRole("heading", { name: "Building a Motion Spec" })).toBeVisible();
});

test("journal search filters the index", async ({ page }) => {
  await page.goto("/blog?search=playbook");
  await expect(page.getByRole("link", { name: "Building a Cinematic Launch Playbook" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My First Blog Post" })).toHaveCount(0);
});

test("performance HUD reports real measurements and persists", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard-driven");
  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 400 } });
  await page.keyboard.press("p");

  const hud = page.getByRole("complementary", { name: "Performance of this visit" });
  await expect(hud).toBeVisible();
  // The LCP row: a measured duration, never the "—" placeholder.
  await expect(hud.locator("dd").nth(1)).toHaveText(/\d+ ms|\d\.\d\d s/);

  await page.reload();
  await expect(hud).toBeVisible();
  await hud.getByRole("button", { name: "Close performance panel" }).click();
  await expect(hud).toBeHidden();
});

test("colophon computes contrast from the live tokens", async ({ page }) => {
  await page.goto("/colophon");
  await expect(page.getByText("19.67 : 1")).toBeVisible();
  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(page.getByText("17.74 : 1")).toBeVisible();
});

test("tapping the Mono/R plate sets its tempo", async ({ page }) => {
  await page.goto("/work/flowstate");
  const plate = page.getByRole("img", { name: /pulses to a tempo/ });
  await plate.scrollIntoViewIfNeeded();
  for (let i = 0; i < 4; i++) {
    await plate.click({ position: { x: 200, y: 120 } });
    await page.waitForTimeout(400);
  }
  await expect(plate).not.toContainText("72 BPM");
  await expect(plate).toContainText(/\d+ BPM/);
});
