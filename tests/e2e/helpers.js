import { expect } from "@playwright/test";

/** Opens the overlay-intro version (?intro=refined) and leaves the intro through "Ana sayfaya geç". */
export async function openHome(page) {
  await page.goto("./?intro=refined");
  await page.getByRole("button", { name: "Ana sayfaya geç" }).click();
  const home = page.locator("main.home");
  await expect(home).toHaveClass(/is-ready/);
  await expect(page.locator(".intro")).toHaveCount(0);
  return home;
}

/** Asserts the document does not scroll sideways. */
export async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}
