import { test, expect, CONTRIBUTIONS_API, SAMPLE } from "./fixtures";

// Task 4: the GitHub activity graph in the footer. The contributions come from the saved
// sample in e2e/data/contributions.json (see fixtures.js), so these tests don't need GitHub.

const activity = (page) => page.getByRole("region", { name: /contributions|GitHub/ });
const graph = (page) => page.getByRole("img", { name: /^GitHub contribution graph/ });

test("shows the live total and one square per day, each in its shade", async ({ page }) => {
  await page.goto("/");
  await expect(activity(page).getByRole("heading", { level: 2 })).toHaveText("382 contributions in the last year");
  await expect(graph(page)).toHaveAccessibleName(
    "GitHub contribution graph: 382 contributions in the last year, from 16 November 2025 to 16 November 2026",
  );

  const days = graph(page).locator("[data-date]");
  await expect(days).toHaveCount(SAMPLE.contributions.length);

  // the busiest day: its shade, and the hover text
  const busiest = SAMPLE.contributions.reduce((a, b) => (b.count > a.count ? b : a));
  const cell = graph(page).locator(`[data-date="${busiest.date}"]`);
  await expect(cell).toHaveClass(new RegExp(`bg-contrib-${busiest.level}`));
  await expect(cell).toHaveAttribute("title", new RegExp(`^${busiest.count} contributions on `));

  // a quiet day and a single-contribution day read naturally
  const quiet = SAMPLE.contributions.find((d) => d.count === 0);
  await expect(graph(page).locator(`[data-date="${quiet.date}"]`)).toHaveAttribute("title", /^No contributions on /);
  const single = SAMPLE.contributions.find((d) => d.count === 1);
  await expect(graph(page).locator(`[data-date="${single.date}"]`)).toHaveAttribute("title", /^1 contribution on /);
});

test("labels the months, oldest to newest", async ({ page }) => {
  await page.goto("/");
  await expect(graph(page).locator("[data-month]")).toHaveText([
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
  ]);
});

test("the '@Justin-25 on GitHub' button opens my profile", async ({ page }) => {
  await page.goto("/");
  const button = activity(page).getByRole("link", { name: "@Justin-25 on GitHub" });
  await expect(button).toBeVisible(); // one per screen size; the other one is hidden
  await expect(button).toHaveAttribute("href", "https://github.com/Justin-25");
  await expect(button).toHaveAttribute("target", "_blank");
});

test("desktop shows the whole year; a phone opens at the newest weeks and scrolls sideways", async ({ page, isMobile }) => {
  await page.goto("/");
  await graph(page).scrollIntoViewIfNeeded();
  const scroller = page.getByTestId("contribution-scroller");
  const newest = graph(page).locator(`[data-date="${SAMPLE.contributions.at(-1).date}"]`);
  const oldest = graph(page).locator(`[data-date="${SAMPLE.contributions[0].date}"]`);
  const { scrollLeft, scrollWidth, clientWidth } = await scroller.evaluate((el) => ({
    scrollLeft: el.scrollLeft,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));

  if (isMobile) {
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    expect(scrollLeft + clientWidth).toBeGreaterThanOrEqual(scrollWidth - 1); // scrolled to the end
    await expect(newest).toBeInViewport();
    await expect(oldest).not.toBeInViewport();
  } else {
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth); // fits, no scrolling
    await expect(newest).toBeInViewport();
    await expect(oldest).toBeInViewport();
  }
});

test("while loading, it shows empty squares and 'Loading contributions…'", async ({ page }) => {
  let release;
  const held = new Promise((resolve) => (release = resolve));
  await page.route(CONTRIBUTIONS_API, async (route) => {
    await held;
    await route.fulfill({ json: SAMPLE });
  });
  await page.goto("/");
  await expect(activity(page).getByRole("heading", { level: 2 })).toHaveText("Loading contributions…");
  await expect(page.getByRole("img", { name: "Loading contributions…" })).toBeVisible();
  await expect(page.locator("footer [data-date]")).toHaveCount(0); // empty placeholder squares only

  release();
  await expect(activity(page).getByRole("heading", { level: 2 })).toHaveText("382 contributions in the last year");
});

for (const [what, fail] of [
  ["the service answers with an error", (route) => route.fulfill({ status: 500, body: "oops" })],
  ["there's no internet", (route) => route.abort("internetdisconnected")],
  ["the answer isn't contribution data", (route) => route.fulfill({ json: { error: "rate limited" } })],
]) {
  test(`if ${what}, the card links to GitHub instead`, async ({ page }) => {
    await page.route(CONTRIBUTIONS_API, fail);
    await page.goto("/");
    const region = activity(page);
    await expect(region.getByText("GitHub activity couldn’t load right now.")).toBeVisible();
    await expect(region.getByRole("link", { name: "View it on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Justin-25",
    );
    await expect(region.getByRole("heading", { level: 2 })).toHaveText("My contributions on GitHub");
    await expect(graph(page)).toHaveCount(0);
  });
}
