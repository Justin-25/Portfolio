import { test, expect } from "./fixtures";

// Task 1: the page shell. Runs at desktop (1440) and phone (390) sizes, see playwright.config.js.

const SECTIONS = [
  { link: "Projects", hash: "#projects", heading: "Things I’ve built" },
  { link: "About", hash: "#about", heading: "About me" },
  { link: "Contact", hash: "#contact", heading: /^Want to collaborate\?/ },
];

// After jumping to a section, its heading must be visible and not hidden under the sticky nav.
// It should sit near the top of the screen, unless the page is already scrolled to the bottom.
async function expectLandedBelowNav(page, heading) {
  const navHeight = await page.getByRole("banner").evaluate((el) => el.getBoundingClientRect().height);
  await expect
    .poll(
      async () => {
        const box = await heading.boundingBox();
        const atBottom = await page.evaluate(
          () => Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1,
        );
        return box !== null && box.y >= navHeight && (box.y < 300 || atBottom);
      },
      { message: "section heading should land just below the sticky nav" },
    )
    .toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("has a descriptive title and the name as the only h1", async ({ page }) => {
  await expect(page).toHaveTitle("Justin John Albert Mandia · Full-Stack Developer");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Justin John Albert Mandia");
});

test("uses the Geist font from the design", async ({ page }) => {
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const h1 = document.querySelector("h1");
    return {
      family: getComputedStyle(h1).fontFamily,
      loaded: [...document.fonts].some(
        (f) => f.family.replaceAll('"', "") === "Geist Variable" && f.status === "loaded",
      ),
    };
  });
  expect(result.family).toMatch(/^"?Geist Variable/);
  expect(result.loaded).toBe(true);
});

test("fits the screen without sideways scrolling", async ({ page }) => {
  // Compare with the real screen width: a phone browser widens the page to fit anything that
  // sticks out, so comparing with window.innerWidth would hide the problem.
  const screen = page.viewportSize().width;
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth, `page is ${scrollWidth}px wide on a ${screen}px screen`).toBeLessThanOrEqual(screen);
});

test("a shared link to a section (/#about) opens at that section", async ({ page }) => {
  await page.goto("/#about");
  await expectLandedBelowNav(page, page.getByRole("heading", { level: 2, name: "About me" }));
});

test("footer links point to GitHub and email", async ({ page }) => {
  const footer = page.getByRole("contentinfo");
  const github = footer.getByRole("link", { name: "GitHub", exact: true });
  await expect(github).toHaveAttribute("href", "https://github.com/Justin-25");
  await expect(github).toHaveAttribute("target", "_blank");
  await expect(github).toHaveAttribute("rel", "noreferrer");
  await expect(footer.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:justinmandia25@gmail.com",
  );
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Justin John Albert Mandia`);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop navigation only");

  for (const section of SECTIONS) {
    test(`nav link "${section.link}" jumps to its section, below the sticky nav`, async ({ page }) => {
      const nav = page.getByRole("navigation", { name: "Main" });
      await nav.getByRole("link", { name: section.link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${section.hash}$`));
      await expectLandedBelowNav(page, page.getByRole("heading", { level: 2, name: section.heading }));
    });
  }

  test("'Get in touch' goes to the contact section", async ({ page }) => {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Get in touch" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expectLandedBelowNav(page, page.getByRole("heading", { level: 2, name: /^Want to collaborate\?/ }));
  });

  test("the first Tab press shows a 'Skip to content' link", async ({ page }) => {
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  });

  test("the phone menu button is hidden", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });
});

test.describe("phone menu", () => {
  test.skip(({ isMobile }) => !isMobile, "phone only");

  test("opens, and tapping a link closes it and jumps to the section", async ({ page }) => {
    await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    for (const { link } of SECTIONS) {
      await expect(menu.getByRole("link", { name: link, exact: true })).toBeVisible();
    }
    await expect(menu.getByRole("link", { name: "Get in touch" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "GitHub" })).toBeVisible();

    // the page behind the open menu doesn't scroll
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");

    await menu.getByRole("link", { name: "About", exact: true }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#about$/);
    await expectLandedBelowNav(page, page.getByRole("heading", { level: 2, name: "About me" }));
  });

  test("Close and Esc both close it, and focus returns to the menu button", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: "Open menu" });
    const menu = page.getByRole("dialog", { name: "Menu" });

    await menuButton.click();
    await expect(menu).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
    await menu.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).toBeHidden();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(menuButton).toBeFocused();
  });
});
