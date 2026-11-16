// Sends a contact-form message to my inbox through Web3Forms (https://web3forms.com).
// The access key only lets Web3Forms email *me*; it comes from VITE_WEB3FORMS_ACCESS_KEY
// (.env.local in development, the Vercel project settings in production).

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 15_000;

export async function sendMessage({ name, email, message }) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) throw new Error("VITE_WEB3FORMS_ACCESS_KEY is not set (see .env.example)");

  // Give up after 15 seconds, so a dead connection doesn't leave the form stuck on "Sending…"
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio: new message from ${name}`,
        from_name: "Portfolio contact form",
        replyto: email, // pressing Reply in my inbox answers the sender
        name,
        email,
        message,
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.success) {
      throw new Error(data?.message || `Web3Forms answered ${response.status}`);
    }
  } finally {
    clearTimeout(timer);
  }
}
