// A wrapping row of Figma "Chip" tags (tech stack, skills).
export default function TagList({ items, label }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-border bg-surface-raised px-2.5 py-1 font-mono text-mono-s text-secondary"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
