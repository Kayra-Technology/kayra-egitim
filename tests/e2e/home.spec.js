import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, openHome } from "./helpers.js";

test("intro hands off to the home page with focus on the brand", async ({ page }) => {
  const home = await openHome(page);
  await expect(home).not.toHaveAttribute("inert", /.*/);
  await expect(page.getByRole("link", { name: "Kayra ana sayfa" })).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Teoriyi sahaya,merakı yetkinliğe.");
  await expectNoHorizontalOverflow(page);
});

test("the site makes no requests to third-party origins", async ({ page, baseURL }) => {
  const self = new URL(baseURL).origin;
  const external = [];
  page.on("request", (request) => {
    const url = request.url();
    if (!url.startsWith("data:") && new URL(url).origin !== self) external.push(url);
  });
  await openHome(page);
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#iletisim").scrollIntoViewIfNeeded();
  expect(external).toEqual([]);
  const families = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
  expect(families).toEqual(expect.arrayContaining(["Kayra Sans", "Kayra Mono"]));
});

test("domain strip jumps to the program and its CTA opens the course", async ({ page }) => {
  await openHome(page);
  await page.getByRole("navigation", { name: "Eğitim alanları" }).getByRole("link", { name: /SUALTI/ }).click();
  const program = page.locator("#program-rov");
  await expect(program).toBeInViewport();
  await program.getByRole("link", { name: "Eğitimi keşfet" }).click();
  await expect(page).toHaveURL(/#\/egitim\/sualti$/);
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeFocused();
  await expect(heading).toHaveCSS("outline-style", "none");
});

test("revealed sections become visible as they scroll into view", async ({ page }) => {
  await openHome(page);
  const statement = page.locator(".home-statement");
  await statement.scrollIntoViewIfNeeded();
  await expect(statement).toHaveClass(/is-revealed/);
  await expect(statement).toHaveCSS("opacity", "1");
});

test("'Alanları keşfet' reopens the intro exploration", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones show only brand and section tabs in the header");
  await openHome(page);
  const replay = page.getByRole("button", { name: "Alanları keşfet" });
  await replay.click();
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.locator("main.home")).toHaveClass(/is-waiting/);
});

test("3D lab is announced as coming soon and not linked", async ({ page }) => {
  await openHome(page);
  const lab = page.locator("#atolye");
  await lab.scrollIntoViewIfNeeded();
  await expect(lab.getByText("Yakında", { exact: true })).toBeVisible();
  await expect(page.locator('a[href*="view=rov-lab"]')).toHaveCount(0);
});

test("home lists the vehicle trainings, the workshop and the published contact", async ({ page }) => {
  await openHome(page);
  await expect(page.locator(".home-program")).toHaveCount(4);
  await expect(page.locator("#program-rocket")).toContainText("Roket sistemlerine giriş");
  const workshop = page.locator(".home-workshop");
  await expect(workshop).toContainText("Görüntü işlemeye giriş");
  await expect(workshop).toHaveAttribute("href", "#/egitim/goruntu-isleme");
  const footer = page.locator("#iletisim");
  await expect(footer.getByRole("link", { name: /kurumsal@kayra\.technology/ })).toHaveAttribute("href", "mailto:kurumsal@kayra.technology");
  await expect(footer).toContainText("İTÜ Özdemir Bayraktar Tasarım ve Prototipleme Merkezi");
  await expect(page.getByText(/kayrarobotics|Temsili görsel/i)).toHaveCount(0);
});

test("one header bar: brand and section tabs, no separate strip or page menu", async ({ page }) => {
  await openHome(page);
  await expect(page.locator(".home-header")).toHaveCount(1);
  await expect(page.locator(".kayra-topbar")).toHaveCount(0);
  const tabs = page.getByRole("navigation", { name: "Kayra bölümleri" });
  await expect(tabs.getByRole("link")).toHaveText(["Ar-Ge", "Eğitim", "Kariyer"]);
  await expect(page.getByRole("navigation", { name: "Ana menü" })).toHaveCount(0);
  const heights = await tabs.getByRole("link").evaluateAll((links) => links.map((link) => link.getBoundingClientRect().height));
  expect(new Set(heights).size).toBe(1); // no tab wraps onto two lines
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("starts in exploration and shows content without animation", async ({ page }) => {
    await page.goto("./?intro=refined");
    await expect(page.locator(".intro-detail, .intro-grid").first()).toBeVisible();
    await page.getByRole("button", { name: "Ana sayfaya geç" }).click();
    const lead = page.locator(".home-lead");
    await expect(lead).toHaveCSS("opacity", "1");
  });
});
