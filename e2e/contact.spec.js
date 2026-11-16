import { test, expect, WEB3FORMS } from "./fixtures";

// Task 3: contact links, the contact form (Web3Forms is faked: no test sends a real email),
// the shared result Modal, and the certificate viewer. Runs at desktop and phone sizes.

// (The shared setup in fixtures.js already makes any un-faked Web3Forms request fail.)
const VALID = {
  name: "  Ada Lovelace ",
  email: "ada@example.com",
  message: "Hello Justin! I'd like to talk about a frontend role.",
};

test.beforeEach(async ({ page }) => {
  await page.goto("/#contact");
});

const form = (page) => page.getByRole("form", { name: "Send a message" });
const sendButton = (page) => form(page).getByRole("button", { name: /^(Send message|Sending…)$/ });

async function fillForm(page, values = VALID) {
  await form(page).getByLabel("Name").fill(values.name);
  await form(page).getByLabel("Email").fill(values.email);
  await form(page).getByLabel("Message").fill(values.message);
}

// Fakes Web3Forms. Returns the request bodies it received, in order.
async function fakeWeb3Forms(page, replies) {
  const bodies = [];
  await page.route(WEB3FORMS, async (route) => {
    bodies.push(route.request().postDataJSON());
    const reply = replies[Math.min(bodies.length, replies.length) - 1];
    if (reply.delay) await new Promise((r) => setTimeout(r, reply.delay));
    await route.fulfill({ status: reply.status, json: reply.json });
  });
  return bodies;
}
const OK = { status: 200, json: { success: true, message: "Email sent successfully!" } };
const SERVER_ERROR = { status: 500, json: { success: false, message: "Something went wrong" } };

test("contact links: email, GitHub and location", async ({ page }) => {
  const contact = page.locator("#contact");
  await expect(contact.getByRole("heading", { level: 2 })).toHaveText(/Want to collaborate\?\s*Contact me\./);
  await expect(contact.getByRole("link", { name: /justinmandia25@gmail\.com/ })).toHaveAttribute(
    "href",
    "mailto:justinmandia25@gmail.com",
  );
  const github = contact.getByRole("link", { name: /github\.com\/Justin-25/ });
  await expect(github).toHaveAttribute("href", "https://github.com/Justin-25");
  await expect(github).toHaveAttribute("target", "_blank");
  await expect(contact.getByText("Malvar, Philippines · Open to remote")).toBeVisible();
});

test("an empty form shows an error under each field, focuses the first, and sends nothing", async ({ page }) => {
  let requests = 0;
  page.on("request", (r) => r.url().startsWith(WEB3FORMS) && requests++);

  await sendButton(page).click();
  const name = form(page).getByLabel("Name");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription("Please enter your name.");
  await expect(form(page).getByLabel("Email")).toHaveAccessibleDescription("Please enter your email address.");
  await expect(form(page).getByLabel("Message")).toHaveAccessibleDescription("Please write a message.");
  await expect(page.getByRole("alertdialog")).toHaveCount(0); // form errors never open the Modal
  expect(requests).toBe(0);
});

test("errors update as the fields are fixed", async ({ page }) => {
  await sendButton(page).click();
  const name = form(page).getByLabel("Name");
  const email = form(page).getByLabel("Email");
  const message = form(page).getByLabel("Message");

  await name.fill("Ada");
  await expect(name).not.toHaveAttribute("aria-invalid");
  await expect(form(page).getByText("Please enter your name.")).toHaveCount(0);

  await email.fill("justin@gmail");
  await expect(email).toHaveAccessibleDescription("Enter a valid email address.");
  await email.fill("justin@gmail.com");
  await expect(email).not.toHaveAttribute("aria-invalid");

  await message.fill("Hi!");
  await expect(message).toHaveAccessibleDescription("Please write at least 10 characters.");
  await message.fill("Hi! Are you free next week?");
  await expect(form(page).getByRole("paragraph").filter({ hasText: /^Please|^Enter/ })).toHaveCount(0);
});

test("sends the message: 'Sending…', then 'Message sent', and the form clears", async ({ page }) => {
  const bodies = await fakeWeb3Forms(page, [{ ...OK, delay: 600 }]);
  await fillForm(page);
  await sendButton(page).click();

  await expect(sendButton(page)).toHaveText("Sending…");
  await expect(sendButton(page)).toHaveAttribute("aria-disabled", "true");
  await expect(form(page).getByLabel("Name")).toHaveAttribute("readonly");

  const modal = page.getByRole("alertdialog", { name: "Message sent" });
  await expect(modal).toBeVisible();
  await expect(modal).toContainText("I’ll reply to the email address you entered.");

  // what Web3Forms received: my key, trimmed values, and replies going to the sender
  expect(bodies).toHaveLength(1);
  expect(bodies[0]).toMatchObject({
    name: "Ada Lovelace",
    email: "ada@example.com",
    replyto: "ada@example.com",
    message: VALID.message,
    subject: "Portfolio: new message from Ada Lovelace",
  });
  expect(bodies[0].access_key).toBeTruthy();

  await modal.getByRole("button", { name: "Done" }).click();
  await expect(modal).toBeHidden();
  for (const label of ["Name", "Email", "Message"]) {
    await expect(form(page).getByLabel(label)).toHaveValue("");
  }
  await expect(sendButton(page)).toHaveText("Send message");
  await expect(sendButton(page)).toBeFocused(); // focus goes back to where it was
});

test("pressing Send twice while sending sends only one message", async ({ page }) => {
  const bodies = await fakeWeb3Forms(page, [{ ...OK, delay: 800 }]);
  await fillForm(page);
  await sendButton(page).click();
  await expect(sendButton(page)).toHaveText("Sending…");
  // force: Playwright would wait for an aria-disabled button to become enabled; a real
  // impatient second click doesn't wait, so click it anyway
  await sendButton(page).click({ force: true });
  await expect(page.getByRole("alertdialog", { name: "Message sent" })).toBeVisible();
  expect(bodies).toHaveLength(1);
});

test("a server error shows 'Message not sent', keeps the message, and 'Try again' resends it", async ({ page }) => {
  const bodies = await fakeWeb3Forms(page, [SERVER_ERROR, OK]);
  await fillForm(page);
  await sendButton(page).click();

  const failed = page.getByRole("alertdialog", { name: "Message not sent" });
  await expect(failed).toBeVisible();
  await expect(failed.getByRole("link", { name: "justinmandia25@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:justinmandia25@gmail.com",
  );
  await expect(form(page).getByLabel("Message")).toHaveValue(VALID.message);

  await failed.getByRole("button", { name: "Try again" }).click();
  await expect(failed).toBeHidden();
  await expect(page.getByRole("alertdialog", { name: "Message sent" })).toBeVisible();
  expect(bodies).toHaveLength(2);
  expect(bodies[1].message).toBe(VALID.message);
});

test("no internet shows 'Message not sent'; Esc and Close both close it", async ({ page }) => {
  // nothing faked: the shared safety net makes the request fail like a lost connection
  await fillForm(page);
  await sendButton(page).click();
  const failed = page.getByRole("alertdialog", { name: "Message not sent" });
  await expect(failed).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(failed).toBeHidden();

  await sendButton(page).click();
  await expect(failed).toBeVisible();
  await failed.getByRole("button", { name: "Close", exact: true }).click();
  await expect(failed).toBeHidden();
  await expect(form(page).getByLabel("Name")).toHaveValue(VALID.name);
});

test("a bot that ticks the hidden honeypot box gets 'Message sent', but nothing is sent", async ({ page }) => {
  let requests = 0;
  page.on("request", (r) => r.url().startsWith(WEB3FORMS) && requests++);
  await fillForm(page);
  // bots fill in the page's fields directly, including ones people can't see
  await page.locator('input[name="botcheck"]').evaluate((box) => (box.checked = true));
  await sendButton(page).click();
  await expect(page.getByRole("alertdialog", { name: "Message sent" })).toBeVisible();
  expect(requests).toBe(0);
});

test.describe("certificate viewer", () => {
  const COURSES = [
    {
      title: "Node.js, Express, MongoDB & More: The Complete Bootcamp",
      url: "https://www.udemy.com/certificate/UC-43349306-f7b0-4b64-afaa-e37d82cb9f51/",
    },
    {
      title: "The Complete Full-Stack Web Development Bootcamp",
      url: "https://www.udemy.com/certificate/UC-abd3149f-d71f-4b37-8133-9954b1c39509/",
    },
  ];

  for (const course of COURSES) {
    test(`shows the certificate for "${course.title.slice(0, 24)}…" with a link to Udemy`, async ({ page }) => {
      const open = page.getByRole("button", { name: `View certificate: ${course.title}` });
      await open.click();

      const viewer = page.getByRole("dialog", { name: course.title });
      await expect(viewer).toBeVisible();
      await expect(viewer).toContainText("Udemy ·");
      const image = viewer.getByRole("img", { name: /^Udemy certificate of completion/ });
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((img) => img.naturalWidth)).toBe(1328);

      const udemy = viewer.getByRole("link", { name: "View on Udemy" });
      await expect(udemy).toHaveAttribute("href", course.url);
      await expect(udemy).toHaveAttribute("target", "_blank");

      // fits a phone screen, and Esc closes it with focus back on the button that opened it
      const box = await viewer.boundingBox();
      expect(box.width).toBeLessThanOrEqual(page.viewportSize().width - 32);
      await page.keyboard.press("Escape");
      await expect(viewer).toBeHidden();
      await expect(open).toBeFocused();
    });
  }

  test("the ✕ button and a click on the backdrop both close it", async ({ page }) => {
    const open = page.getByRole("button", { name: `View certificate: ${COURSES[0].title}` });
    const viewer = page.getByRole("dialog", { name: COURSES[0].title });

    await open.click();
    await viewer.getByRole("button", { name: "Close dialog" }).click();
    await expect(viewer).toBeHidden();

    await open.click();
    await expect(viewer).toBeVisible();
    await page.mouse.click(5, 5); // top-left corner: the dimmed backdrop, outside the dialog
    await expect(viewer).toBeHidden();
  });
});
