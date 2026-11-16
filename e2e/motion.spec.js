import { test, expect } from "./fixtures";

// Task 5: calm motion (CLAUDE.md "Motion"). Runs at desktop and phone sizes.

const lift = (locator) => locator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);

test("nothing on screen at load is hidden; content below fades in when scrolled to", async ({ page }) => {
  await page.goto("/");
  const hiddenOnScreen = await page.evaluate(
    () => [...document.querySelectorAll(".reveal-hidden")].filter((el) => el.getBoundingClientRect().top < innerHeight).length,
  );
  expect(hiddenOnScreen).toBe(0);

  // the Tooth Fairy card starts below the screen at both sizes
  const block = page.locator("[data-reveal]").filter({ has: page.getByRole("heading", { name: "Tooth Fairy Dentistry" }) });
  await expect(block).toHaveClass(/reveal-hidden/);
  await block.scrollIntoViewIfNeeded();
  await expect(block).not.toHaveClass(/reveal-hidden/);
  await expect.poll(() => block.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
});

test("education rows appear one after another, 60ms apart", async ({ page }) => {
  await page.goto("/");
  const delays = await page
    .locator("#about ol > li")
    .evaluateAll((rows) => rows.map((row) => row.style.transitionDelay || "0ms"));
  expect(delays).toEqual(["0ms", "60ms", "120ms"]);
});

test("project cards lift 2px on hover", async ({ page, isMobile }) => {
  test.skip(isMobile, "touch screens have no hover");
  await page.goto("/");
  const card = page.locator("#projects article").first();
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.locator("xpath=..").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  expect(await lift(card)).toBe(0);
  await card.hover();
  await expect.poll(() => lift(card)).toBe(-2);
});

test("with 'reduce motion', nothing is hidden and cards don't lift", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".reveal-hidden")).toHaveCount(0);
  const card = page.locator("#projects article").first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await page.waitForTimeout(300); // longer than the 200ms hover transition
  expect(await lift(card)).toBe(0);
});
