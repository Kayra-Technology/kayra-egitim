import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers.js";

const courses = [["hava", "Hava sistemleri", 6], ["sualti", "Su altı sistemleri", 6], ["suustu", "Deniz sistemleri", 6], ["roket", "Roket sistemleri", 3], ["goruntu-isleme", "Görüntü işleme", 5]];

for (const [slug, domain, topics] of courses) {
  test(`course page #/egitim/${slug} renders directly`, async ({ page }) => {
    await page.goto(`./#/egitim/${slug}`);
    await expect(page.getByRole("navigation", { name: "Sayfa yolu" })).toContainText(domain);
    await expect(page.locator(".course-topic")).toHaveCount(topics);
    await expect(page.locator(".course-related nav a")).toHaveCount(4);
    await expect(page.getByRole("link", { name: /Bilgi al/ })).toHaveAttribute("href", /^mailto:kurumsal@kayra\.technology\?subject=/);
    await expectNoHorizontalOverflow(page);
  });
}

test("course back link returns to the home programs section", async ({ page }) => {
  await page.goto("./#/egitim/roket");
  await page.getByRole("link", { name: "Tüm eğitimler" }).click();
  await expect(page).toHaveURL(/#alanlar$/);
  await expect(page.locator("#alanlar")).toBeInViewport();
});

test("hands-on block appears only when the course lists practice", async ({ page }) => {
  await page.goto("./#/egitim/sualti");
  await expect(page.getByRole("heading", { name: "Elle tutulur çalışmalar." })).toBeVisible();
  await page.goto("./#/egitim/roket");
  await expect(page.getByRole("heading", { name: "Elle tutulur çalışmalar." })).toHaveCount(0);
});

test("course topics stack in one column on mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile layout only");
  await page.goto("./#/egitim/sualti");
  const [first, second] = await page.locator(".course-topic").evaluateAll((items) => items.slice(0, 2).map((item) => item.getBoundingClientRect().left));
  expect(second).toBe(first);
});

test("workshop page shows its format and a drawing instead of a photo", async ({ page }) => {
  await page.goto("./#/egitim/goruntu-isleme");
  await expect(page.locator(".course-meta")).toContainText("1 GÜN · 4 SAAT");
  await expect(page.locator(".course-hero-drawing")).toBeVisible();
  await expect(page.locator(".course-hero-photo")).toHaveCount(0);
});

test("removed land-vehicle route falls back to the home page", async ({ page }) => {
  await page.goto("./#/egitim/kara");
  await expect(page.locator(".course-page")).toHaveCount(0);
});

for (const variant of ["hover", "click"]) {
  test(`archived intro variant ?intro=${variant} still loads`, async ({ page }) => {
    await page.goto(`./?intro=${variant}`);
    await expect(page.locator(".intro")).toBeVisible();
    await expect(page.locator(".intro-item")).toHaveCount(4);
  });
}

test("3D lab loads the Draco model from the bundled decoder", async ({ page }) => {
  const failed = [];
  page.on("requestfailed", (request) => failed.push(request.url()));
  page.on("response", (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await page.goto("./?view=rov-lab");
  await expect(page.getByRole("button", { name: "Modeli yakınlaştır" })).toBeEnabled({ timeout: 20_000 });
  await expect(page.locator(".lab-viewer canvas")).toBeVisible();
  await expect(page.locator(".lab-error")).toHaveCount(0);
  expect(failed).toEqual([]);
});

// Brochures reached by printed QR codes; their URLs must stay stable.
for (const slug of ["usv", "c-usv", "iha", "rov"]) {
  test(`brochure belgeler/kayra-${slug}-brosur.pdf is served as a PDF`, async ({ request }) => {
    const response = await request.get(`./belgeler/kayra-${slug}-brosur.pdf`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });
}
