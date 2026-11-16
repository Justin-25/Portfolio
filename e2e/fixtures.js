import { readFileSync } from "node:fs";
import { test as base, expect } from "@playwright/test";

// Every test runs without live services, so results never depend on the network:
// - GitHub contributions come from a saved sample (e2e/data/contributions.json, 382 in total);
// - any Web3Forms request a test doesn't fake on purpose fails like a lost connection,
//   so no test can ever send a real email.
export const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/**";
export const WEB3FORMS = "https://api.web3forms.com/submit";
export const SAMPLE = JSON.parse(readFileSync(new URL("./data/contributions.json", import.meta.url), "utf8"));

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(CONTRIBUTIONS_API, (route) => route.fulfill({ json: SAMPLE }));
    await page.route(WEB3FORMS, (route) => route.abort("internetdisconnected"));
    await use(page);
  },
});

export { expect };
