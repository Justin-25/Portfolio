// Figma "Badge": a small pill, optionally with a glowing white status dot.
export default function Badge({ children, dot = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.25 text-label-s text-secondary ${className}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-accent shadow-[0_0_6px_rgb(255_255_255/0.7)]"
        />
      )}
      {children}
    </span>
  );
}
