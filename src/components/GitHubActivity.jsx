import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import { githubActivity as copy, profile } from "../content";
import { fetchContributions } from "../lib/contributions";
import { buttonClass } from "./ui";

const TIMEOUT_MS = 10_000;
const LEVEL = ["bg-contrib-0", "bg-contrib-1", "bg-contrib-2", "bg-contrib-3", "bg-contrib-4"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const toDate = (iso) => new Date(`${iso}T00:00:00Z`);

// While loading: 53 empty weeks, so the card already has its final size and nothing jumps
const PLACEHOLDER_WEEKS = Array.from({ length: 53 }, () => Array.from({ length: 7 }, () => ({ level: 0 })));

// Columns are weeks from Sunday to Saturday, as on GitHub. The first week can start mid-week.
function toWeeks(days) {
  const offset = toDate(days[0].date).getUTCDay();
  const weeks = [];
  days.forEach((day, i) => {
    const slot = i + offset;
    (weeks[Math.floor(slot / 7)] ??= [])[slot % 7] = day;
  });
  return weeks;
}

// A month's name goes above the week that holds its 1st day. The partial month at the start
// gets a name too, if there's room before the next one.
function monthLabels(weeks) {
  const labels = [];
  weeks.forEach((week, index) => {
    const first = week.find((day) => day?.date?.endsWith("-01"));
    if (first) labels.push({ index, name: MONTHS[toDate(first.date).getUTCMonth()] });
  });
  const start = weeks[0].find((day) => day?.date);
  if (start && (labels[0]?.index ?? Infinity) >= 2) {
    labels.unshift({ index: 0, name: MONTHS[toDate(start.date).getUTCMonth()] });
  }
  return labels;
}

function describe(day) {
  const n = day.count;
  return `${n === 0 ? "No" : n} contribution${n === 1 ? "" : "s"} on ${longDate.format(toDate(day.date))}`;
}

// Footer "GitHub activity" (Figma "Footer"): my contribution graph for the last 12 months.
export default function GitHubActivity() {
  const [state, setState] = useState({ status: "loading" });
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetchContributions(profile.githubHandle, controller.signal)
      .then((data) => !cancelled && setState({ status: "ready", ...data }))
      .catch((error) => {
        if (cancelled) return;
        console.error("GitHub activity: the contributions could not be loaded.", error);
        setState({ status: "error" });
      })
      .finally(() => clearTimeout(timer));
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  // Where the graph is wider than the screen (phones), it scrolls sideways: show the newest weeks first
  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [state]);

  const ready = state.status === "ready";
  const weeks = ready ? toWeeks(state.days) : PLACEHOLDER_WEEKS;
  const months = ready ? monthLabels(weeks) : [];
  const title = {
    loading: copy.loading,
    ready: ready && `${state.total.toLocaleString("en-US")} contributions in the last year`,
    error: "My contributions on GitHub",
  }[state.status];
  const summary = ready
    ? `GitHub contribution graph: ${title}, from ${longDate.format(toDate(state.days[0].date))} to ${longDate.format(toDate(state.days.at(-1).date))}`
    : copy.loading;

  const profileLink = (extra) => (
    <a href={profile.github} target="_blank" rel="noreferrer" className={extra}>
      <FaGithub aria-hidden="true" className="size-4" />@{profile.githubHandle} on GitHub
      <LuArrowUpRight aria-hidden="true" className="size-4" />
    </a>
  );

  return (
    <section aria-labelledby="github-activity-title" className="space-y-5 md:space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow text-muted">{copy.eyebrow}</p>
          <h2
            id="github-activity-title"
            className={`text-heading-m ${state.status === "loading" ? "text-muted" : "text-primary"}`}
          >
            {title}
          </h2>
        </div>
        {/* wrapper hides it on phones (the button's own inline-flex would override "hidden") */}
        <div className="hidden shrink-0 md:block">{profileLink(buttonClass("secondary", "sm"))}</div>
      </div>

      <div className="rounded-xl border border-border bg-surface px-5 pt-5 pb-4 md:px-6 md:pt-6 md:pb-5">
        {state.status === "error" ? (
          <div className="flex flex-col items-start gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-body-s text-secondary">{copy.unavailable}</p>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-label-s text-primary transition-colors duration-150 ease-soft hover:text-accent-hover"
            >
              View it on GitHub
              <LuArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        ) : (
          <>
            {/* Square size and gap: 12px / 3px on phones, 16px / 4px from 768px (as in Figma) */}
            <div className="mx-auto flex w-fit max-w-full gap-2 [--cell:12px] [--gap:3px] md:[--cell:16px] md:[--gap:4px]">
              <div aria-hidden="true" className="flex shrink-0 flex-col gap-(--gap) pt-5 md:pt-6">
                {WEEKDAYS.map((day, i) => (
                  <span key={i} className="h-(--cell) font-mono text-[10px] leading-(--cell) text-muted md:text-mono-s md:leading-(--cell)">
                    {day}
                  </span>
                ))}
              </div>
              <div ref={scrollRef} data-testid="contribution-scroller" className="min-w-0 overflow-x-auto scrollbar-thin">
                <div role="img" aria-label={summary} className="relative w-max pt-5 md:pt-6">
                  {months.map(({ index, name }) => (
                    <span
                      key={`${index}-${name}`}
                      data-month
                      className="absolute top-0 font-mono text-mono-s text-muted"
                      style={{ left: `calc(${index} * (var(--cell) + var(--gap)))` }}
                    >
                      {name}
                    </span>
                  ))}
                  <div className="flex gap-(--gap)">
                    {weeks.map((week, w) => (
                      <div key={w} className="flex flex-col gap-(--gap)">
                        {Array.from({ length: 7 }, (_, r) => {
                          const day = week[r];
                          if (!day) return <span key={r} className="size-(--cell)" />;
                          return (
                            <span
                              key={r}
                              data-date={day.date}
                              title={day.date ? describe(day) : undefined}
                              className={`size-(--cell) rounded-xs md:rounded-[3px] ${LEVEL[day.level] ?? LEVEL[0]}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-4 md:justify-between">
              <p className="hidden font-mono text-mono-s text-muted md:block">{copy.source}</p>
              <div aria-hidden="true" className="flex items-center gap-1 font-mono text-mono-s text-muted">
                <span className="mr-1">Less</span>
                {LEVEL.map((shade) => (
                  <span key={shade} className={`size-2.5 rounded-xs md:size-3 ${shade}`} />
                ))}
                <span className="ml-1">More</span>
              </div>
            </div>
          </>
        )}
      </div>

      {profileLink(`${buttonClass("secondary")} w-full md:hidden`)}
    </section>
  );
}
