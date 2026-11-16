import { test, expect } from "@playwright/test";

// Task 2: hero, projects, about & skills, education & courses, background spotlight.
// Runs at desktop (1440) and phone (390) sizes, see playwright.config.js.

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// Scrolls every image into view (so lazy ones load), then lists any visible image that failed
async function brokenImages(page) {
  for (const img of await page.locator("img:visible").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty("complete", true);
  }
  return page.evaluate(() =>
    [...document.images]
      .filter((img) => img.checkVisibility() && img.naturalWidth === 0)
      .map((img) => img.getAttribute("src")),
  );
}

test("hero: badge, role, intro, buttons and location", async ({ page }) => {
  const hero = page.locator("#top");
  await expect(hero.getByText("Available for work")).toBeVisible();
  await expect(hero.getByText("Full-Stack Developer", { exact: true })).toBeVisible();
  await expect(hero.getByText(/^I build complete web applications/)).toBeVisible();
  await expect(hero.getByText("Malvar, Philippines")).toBeVisible();
  await expect(hero.getByText("Open to remote work")).toBeVisible();
  await expect(hero.getByRole("link", { name: "View projects" })).toHaveAttribute("href", "#projects");
  await expect(hero.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "#contact");
  // not ready yet, so not shown
  await expect(hero.getByRole("link", { name: "Download CV" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveCount(0);
});

test("hero: shows one grayscale photo for this screen size", async ({ page, isMobile }) => {
  const photos = page.locator("#top img:visible");
  await expect(photos).toHaveCount(1);
  const photo = photos.first();
  await expect(photo).toHaveAttribute("alt", /Justin Mandia smiling/);
  await expect(photo).toHaveJSProperty("complete", true);
  expect(await photo.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  expect(await photo.evaluate((img) => getComputedStyle(img).filter)).toContain("grayscale(1)");
  // phone: round 72px avatar; desktop: the 400 x 480 card
  const box = await photo.boundingBox();
  if (isMobile) expect([box.width, box.height]).toEqual([72, 72]);
  else expect([Math.round(box.width), Math.round(box.height)]).toEqual([398, 478]); // inside a 1px border
});

test("projects: Tooth Fairy card with its links, and the e-commerce card", async ({ page }) => {
  const section = page.locator("#projects");
  const featured = section.getByRole("article").filter({ hasText: "Tooth Fairy Dentistry" });
  await expect(featured.getByRole("heading", { level: 3, name: "Tooth Fairy Dentistry" })).toBeVisible();
  await expect(featured.getByText("Featured project")).toBeVisible();
  await expect(featured.getByRole("listitem").filter({ hasText: "70 Playwright end-to-end tests" })).toBeVisible();
  await expect(featured.getByRole("list", { name: "Built with" }).getByRole("listitem")).toHaveText([
    "React", "Node.js", "Express", "MongoDB", "TanStack Query", "Tailwind CSS", "Playwright",
  ]);

  const live = featured.getByRole("link", { name: "Live demo" });
  await expect(live).toHaveAttribute("href", "https://dental-clinic-three-kappa.vercel.app");
  await expect(live).toHaveAttribute("target", "_blank");
  const code = featured.getByRole("link", { name: "View code" });
  await expect(code).toHaveAttribute("href", "https://github.com/Justin-25/DentalClinic-FullStack-project");
  await expect(code).toHaveAttribute("rel", "noreferrer");

  const building = section.getByRole("article").filter({ hasText: "Currently building" });
  await expect(building.getByRole("heading", { level: 3, name: "E-commerce web app" })).toBeVisible();
  await expect(building.getByText("In progress")).toBeVisible();
  await expect(building.getByText(/refresh-token rotation, MongoDB Atlas and Redis/)).toBeVisible();
  await expect(building.getByRole("link", { name: "Follow on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/Justin-25/E-commerce-FullStack-project",
  );
});

test("about: bio, motto and the four skill groups", async ({ page }) => {
  const section = page.locator("#about");
  await expect(section.getByText(/2025 Computer Science graduate from Malvar/)).toBeVisible();
  await expect(section.getByText(/open to full-stack and frontend roles/)).toBeVisible();
  await expect(section.getByText("Keep learning. Keep growing.", { exact: false })).toBeVisible();
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Frontend", "Backend", "Databases", "Testing & tools", "Education & courses",
  ]);
  await expect(section.getByRole("list", { name: "Backend skills" }).getByRole("listitem")).toHaveText([
    "Node.js", "Express", "REST APIs", "JWT auth",
  ]);
});

test("education: two Udemy courses with certificate links, then the degree", async ({ page }) => {
  const items = page.locator("#about ol > li");
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Node.js, Express, MongoDB & More: The Complete Bootcamp");
  await expect(items.nth(0)).toContainText("Aug 2026");
  await expect(items.nth(0).getByRole("link", { name: /^View certificate/ })).toHaveAttribute(
    "href",
    "https://www.udemy.com/certificate/UC-43349306-f7b0-4b64-afaa-e37d82cb9f51/",
  );
  await expect(items.nth(1)).toContainText("The Complete Full-Stack Web Development Bootcamp");
  await expect(items.nth(1).getByRole("link", { name: /^View certificate/ })).toHaveAttribute(
    "href",
    "https://www.udemy.com/certificate/UC-abd3149f-d71f-4b37-8133-9954b1c39509/",
  );
  // each certificate link says which course it belongs to (for screen readers)
  await expect(items.nth(1).getByRole("link")).toHaveAccessibleName(
    "View certificate: The Complete Full-Stack Web Development Bootcamp",
  );
  await expect(items.nth(2)).toContainText("Bachelor of Science in Computer Science");
  await expect(items.nth(2)).toContainText("Tanauan Institute");
  await expect(items.nth(2).getByRole("link")).toHaveCount(0);
});

test("every image loads", async ({ page }) => {
  expect(await brokenImages(page)).toEqual([]);
});

test("fits the screen without sideways scrolling, top to bottom", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
});

test.describe("background spotlight", () => {
  // The window is 792px wide, so its top-left corner sits 396px up and left of the cursor
  const HALF = 396;
  const translation = (locator) =>
    locator.evaluate((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return [Math.round(m.m41), Math.round(m.m42)];
    });

  test("desktop: starts in the hero, then follows the mouse with the grid kept in place", async ({ page, isMobile }) => {
    test.skip(isMobile, "needs a mouse");
    const spot = page.getByTestId("spotlight");
    const grid = page.getByTestId("spotlight-grid");
    await expect(spot).toBeVisible();
    await expect(page.getByTestId("static-glow")).toBeHidden();

    // starts beside the name: 54% across, 420px down
    await expect.poll(() => translation(spot)).toEqual([Math.round(1440 * 0.54) - HALF, 420 - HALF]);

    await page.mouse.move(300, 250);
    await page.mouse.move(1000, 600, { steps: 5 });
    await expect.poll(() => translation(spot)).toEqual([1000 - HALF, 600 - HALF]);
    // the bright grid moves the opposite way, so its lines stay on the faint grid
    await expect.poll(() => translation(grid)).toEqual([-(1000 - HALF), -(600 - HALF)]);
  });

  test("desktop with 'reduce motion': no spotlight, a still glow instead", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop setting");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.getByTestId("spotlight")).toBeHidden();
    await expect(page.getByTestId("static-glow")).toBeVisible();
  });

  test("phone: no spotlight, a still glow at the top instead", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch screens only");
    await expect(page.getByTestId("spotlight")).toBeHidden();
    await expect(page.getByTestId("static-glow")).toBeVisible();
  });
});
