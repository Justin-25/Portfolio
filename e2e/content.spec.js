import { test, expect } from "./fixtures";

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
});

test("'Download CV' downloads the public resume PDF", async ({ page, isMobile }) => {
  const cv = page.locator("#top").getByRole("link", { name: "Download CV" });
  await expect(cv).toBeVisible();
  await expect(cv).toHaveAttribute("href", "/Justin-Mandia-Resume.pdf");
  await expect(cv).toHaveAttribute("download", "");

  // phones: a full-width row under "View projects" and "Contact me"
  if (isMobile) {
    const [cvBox, viewBox] = await Promise.all([cv.boundingBox(), page.getByRole("link", { name: "View projects" }).boundingBox()]);
    expect(cvBox.y).toBeGreaterThan(viewBox.y + viewBox.height);
    expect(cvBox.width).toBeCloseTo(page.viewportSize().width - 48, 0);
  }

  // clicking it really downloads the file, under a clear name
  const [download] = await Promise.all([page.waitForEvent("download"), cv.click()]);
  expect(download.suggestedFilename()).toBe("Justin-Mandia-Resume.pdf");

  // the server sends a real one-page PDF
  const response = await page.request.get("/Justin-Mandia-Resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const body = await response.body();
  expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  expect(body.toString("latin1").match(/\/Type\s*\/Page[^s]/g)).toHaveLength(1);
});

test("LinkedIn appears everywhere the design shows it", async ({ page, isMobile }) => {
  const LINKEDIN = "https://www.linkedin.com/in/justin-mandia-9a006b450/";
  const links = [
    page.getByRole("contentinfo").getByRole("link", { name: "LinkedIn", exact: true }),
    page.locator("#contact").getByRole("link", { name: /LinkedIn profile/ }),
  ];
  // the hero's icon buttons are desktop-only; on phones LinkedIn is in the menu instead
  if (!isMobile) links.push(page.locator("#top").getByRole("link", { name: "LinkedIn" }));
  for (const link of links) {
    await expect(link).toHaveAttribute("href", LINKEDIN);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      LINKEDIN,
    );
  }
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

test("about: bio, motto and the five skill groups, including AI tools", async ({ page }) => {
  const section = page.locator("#about");
  await expect(section.getByText(/2025 Computer Science graduate from Malvar/)).toBeVisible();
  await expect(section.getByText(/open to full-stack and frontend roles/)).toBeVisible();
  await expect(
    section.getByText("I use AI tools like Claude to build faster, and I review and test everything before it ships.", { exact: false }),
  ).toBeVisible();
  await expect(section.getByText("Keep learning. Keep growing.", { exact: false })).toBeVisible();
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Frontend", "Backend", "Databases", "Testing & tools", "AI tools", "Education & courses",
  ]);
  await expect(section.getByRole("list", { name: "Backend skills" }).getByRole("listitem")).toHaveText([
    "Node.js", "Express", "REST APIs", "JWT auth",
  ]);
  await expect(section.getByRole("list", { name: "AI tools skills" }).getByRole("listitem")).toHaveText([
    "Claude Pro", "Claude Code",
  ]);
});

test("education: two Udemy courses with a 'View certificate' button, then the degree", async ({ page }) => {
  const items = page.locator("#about ol > li");
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Node.js, Express, MongoDB & More: The Complete Bootcamp");
  await expect(items.nth(0)).toContainText("Aug 2026");
  await expect(items.nth(1)).toContainText("The Complete Full-Stack Web Development Bootcamp");
  // each button says which course it belongs to (for screen readers)
  for (const i of [0, 1]) {
    await expect(items.nth(i).getByRole("button", { name: /^View certificate: / })).toBeVisible();
  }
  await expect(items.nth(1).getByRole("button")).toHaveAccessibleName(
    "View certificate: The Complete Full-Stack Web Development Bootcamp",
  );
  await expect(items.nth(2)).toContainText("Bachelor of Science in Computer Science");
  await expect(items.nth(2)).toContainText("Tanauan Institute");
  await expect(items.nth(2)).toContainText("2022 – 2025");
  // the years are two machine-readable dates, on one line
  await expect(items.nth(2).locator("time")).toHaveCount(2);
  await expect(items.nth(2).locator("time").first()).toHaveAttribute("datetime", "2022");
  await expect(items.nth(2).locator("time").last()).toHaveAttribute("datetime", "2025");
  const range = items.nth(2).locator("time").first().locator("..");
  expect((await range.boundingBox()).height).toBeLessThanOrEqual(16); // Mono/S line height: no wrapping
  await expect(items.nth(2).getByRole("button")).toHaveCount(0);
});

test("every image loads", async ({ page }) => {
  expect(await brokenImages(page)).toEqual([]);
});

test("fits the screen without sideways scrolling, top to bottom", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  // the real screen width (see the note in shell.spec.js)
  const screen = page.viewportSize().width;
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth, `page is ${scrollWidth}px wide on a ${screen}px screen`).toBeLessThanOrEqual(screen);
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
