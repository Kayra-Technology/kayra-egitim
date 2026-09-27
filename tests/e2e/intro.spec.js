import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers.js";

test("default intro shows a persistent 'Keşfet' hint once the drawing ends", async ({ page }) => {
  await page.goto("./");
  const hints = page.locator(".intro-item-hint");
  await expect(hints).toHaveCount(4);
  // Wait for the hint's own fade-in to finish instead of a fixed timeout (slow CI under load).
  await hints.first().evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
  await expect(hints.first()).toHaveCSS("opacity", "1");
});

test("default intro text is at least 11px", async ({ page }) => {
  await page.goto("./");
  const sizes = await page.locator(".intro-heading, .intro-item-label, .intro-explore-hint, .refined-footer span")
    .evaluateAll((elements) => elements.map((element) => parseFloat(getComputedStyle(element).fontSize)));
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(11);
});

test("intro panel keeps its styled CTA and sans-serif summaries", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".intro-item-summary").first()).toHaveCSS("font-family", /Kayra Sans/);
  await page.locator(".intro-item").nth(3).click();
  const cta = page.locator("#refined-training-detail .intro-discover");
  await expect(cta).toHaveCSS("background-color", "rgb(61, 87, 72)");
  await expect(cta).toHaveCSS("min-height", "44px");
});

test("the scrolling intro is the default opening", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".intro.intro-inline")).toBeVisible();
  await expect(page.getByRole("button", { name: "Eğitimleri gör" })).toBeVisible();
  await page.goto("./?intro=refined");
  await expect(page.locator(".intro.intro-inline")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ana sayfaya geç" })).toBeVisible();
});

test.describe("?intro=scroll", () => {
  test("renders the intro as the first home section without locking scroll", async ({ page }) => {
    await page.goto("./?intro=scroll");
    const intro = page.locator(".intro.intro-inline");
    await expect(intro).toBeVisible();
    await expect(intro).toHaveCSS("position", "relative");
    await expect(page.locator("main.home")).toHaveClass(/is-ready/);
    await expect(page.locator(".home-hero")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Kayra Technology/);
    await expect(page.getByRole("button", { name: "Ana sayfaya geç" })).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    await expectNoHorizontalOverflow(page);
  });

  test("the scroll cue fits the first screen and leads to the programs", async ({ page }) => {
    await page.goto("./?intro=scroll");
    const cue = page.getByRole("button", { name: "Eğitimleri gör" });
    await expect(cue).toBeInViewport({ ratio: 1 });
    await cue.click();
    await expect(page.locator("#alanlar")).toBeInViewport();
  });

  test("vehicle selection still opens the training panel", async ({ page }) => {
    await page.goto("./?intro=scroll");
    await page.locator(".intro-item").nth(1).click();
    const panel = page.locator("#refined-training-detail");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("heading", { name: "Yüzeyin altında." })).toBeVisible();
    // The panel is inert while it slides in; wait for that and its animations, then use the keyboard
    // (a pointer click can land under the sticky site header after auto-scroll on small screens).
    await expect(panel).not.toHaveAttribute("inert", /.*/);
    await panel.evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)));
    await panel.getByRole("button", { name: "Eğitimi keşfet" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/egitim\/sualti$/);
  });

  test("header 'Alanları keşfet' scrolls back to the intro", async ({ page }) => {
    await page.goto("./?intro=scroll");
    await page.locator("#yaklasim").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Alanları keşfet" }).click();
    await expect(page.locator(".intro-heading")).toBeInViewport();
  });
});
