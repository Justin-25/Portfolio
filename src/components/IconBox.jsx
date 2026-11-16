// Figma "Icon box": a square tile holding an icon. `size` and `iconSize` are Tailwind size classes.
export default function IconBox({
  icon: Icon,
  size = "size-11",
  iconSize = "size-5",
  rounded = "rounded-[10px]",
  className = "",
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center border border-border bg-surface-raised text-primary ${size} ${rounded} ${className}`}
    >
      <Icon className={iconSize} />
    </span>
  );
}
