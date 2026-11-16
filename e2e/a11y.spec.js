import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

// Task 5: accessibility. axe checks against WCAG 2.2 A/AA (contrast, names, labels, ARIA, …)
// in every state a visitor can reach, plus keyboard-only use. Runs at desktop and phone sizes.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Problems found, as readable lines (empty list = none)
async function axeProblems(page, include) {
  const builder = new AxeBuilder({ page }).withTags(WCAG);
  if (include) builder.include(include);
  const { violations } = await builder.analyze();
  return violations.map(
    (v) => `${v.id} [${v.impact}] ${v.help}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`,
  );
}

test.describe("axe", () => {
  // No fade-ins, so everything is checked in its final colours
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("the whole page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer [data-date]").first()).toBeAttached(); // GitHub graph loaded
    expect(await axeProblems(page)).toEqual([]);
  });

  test("the contact form showing its errors", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    expect(await axeProblems(page, "#contact")).toEqual([]);
  });

  test("the 'Message not sent' modal", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.getByRole("form", { name: "Send a message" });
    await form.getByLabel("Name").fill("Ada");
    await form.getByLabel("Email").fill("ada@example.com");
    await form.getByLabel("Message").fill("Hello, this is a test message.");
    await form.getByRole("button", { name: "Send message" }).click(); // the shared safety net fails it
    await expect(page.getByRole("alertdialog", { name: "Message not sent" })).toBeVisible();
    expect(await axeProblems(page, "dialog[open]")).toEqual([]);
  });

  test("the certificate viewer", async ({ page }) => {
    await page.goto("/#about");
    await page.getByRole("button", { name: /^View certificate: Node/ }).click();
    await expect(page.getByRole("dialog", { name: /^Node\.js/ })).toBeVisible();
    expect(await axeProblems(page, "dialog[open]")).toEqual([]);
  });

  test("the phone menu", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    expect(await axeProblems(page, "dialog[open]")).toEqual([]);
  });

  test("GitHub activity when it can't load", async ({ page }) => {
    await page.route("https://github-contributions-api.jogruber.de/**", (route) => route.fulfill({ status: 500 }));
    await page.goto("/");
    await expect(page.getByText("GitHub activity couldn’t load right now.")).toBeVisible();
    expect(await axeProblems(page, "footer")).toEqual([]);
  });
});

test.describe("keyboard only", () => {
  test.skip(({ isMobile }) => isMobile, "keyboard use is checked at desktop size");

  test("Tab moves through the nav and hero in reading order, with a visible focus ring", async ({ page }) => {
    await page.goto("/");
    const order = [
      "Skip to content", "Justin Mandia", "Projects", "About", "Contact", "GitHub", "Get in touch",
      "View projects", "Contact me", "GitHub", "LinkedIn",
    ];
    for (const name of order) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toHaveAccessibleName(name);
      const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline, `focus ring on "${name}"`).not.toBe("none");
    }
  });

  test("the form can be filled in and sent without a mouse", async ({ page }) => {
    await page.goto("/#contact");
    await page.locator("#contact-name").focus();
    await page.keyboard.type("Ada");
    await page.keyboard.press("Tab");
    await page.keyboard.type("ada@example.com");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Hello, this is a keyboard test.");
    await page.keyboard.press("Tab"); // skips the hidden honeypot
    await expect(page.getByRole("button", { name: "Send message" })).toBeFocused();
    await page.keyboard.press("Enter");
    const failed = page.getByRole("alertdialog", { name: "Message not sent" }); // shared safety net
    await expect(failed).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(failed).toBeHidden();
    await expect(page.getByRole("button", { name: "Send message" })).toBeFocused();
  });

  test("a certificate opens with Enter and closes with Esc", async ({ page }) => {
    await page.goto("/#about");
    const button = page.getByRole("button", { name: /^View certificate: Node/ });
    await button.focus();
    await page.keyboard.press("Enter");
    const viewer = page.getByRole("dialog", { name: /^Node\.js/ });
    await expect(viewer).toBeVisible();
    await expect(viewer.getByRole("button", { name: "Close dialog" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
    await expect(button).toBeFocused();
  });
});
