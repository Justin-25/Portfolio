// My GitHub contributions for the last 12 months, from a free public service that reads the
// contribution graph on my GitHub profile (https://github.com/grubersjoe/github-contributions-api).
// No key needed, and it allows calls from any website.

export function contributionsUrl(username) {
  return `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
}

// Resolves to { total, days: [{ date: "2026-03-04", count: 3, level: 0-4 }, …] }, oldest first.
export async function fetchContributions(username, signal) {
  const response = await fetch(contributionsUrl(username), { signal });
  if (!response.ok) throw new Error(`Contributions API answered ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data?.contributions) || typeof data?.total?.lastYear !== "number") {
    throw new Error("Contributions API sent an unexpected response");
  }
  return { total: data.total.lastYear, days: data.contributions };
}
