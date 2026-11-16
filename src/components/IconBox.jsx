// Figma "Icon box": a square tile holding a 20px icon. `size` is a Tailwind size class.
export default function IconBox({ icon: Icon, size = "size-11", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[10px] border border-border bg-surface-raised text-primary ${size} ${className}`}
    >
      <Icon className="size-5" />
    </span>
  );
}
