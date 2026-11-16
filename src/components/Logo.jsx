import { profile } from "../content";

// Figma "Logo": the JM mark plus the wordmark. Links back to the top of the page.
export default function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 rounded-md">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-md bg-accent font-mono text-xs font-semibold tracking-[-0.04em] text-on-accent"
      >
        {profile.initials}
      </span>
      <span className="text-label-m text-primary">{profile.shortName}</span>
    </a>
  );
}
