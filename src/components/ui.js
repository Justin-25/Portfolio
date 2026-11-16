// Class names for the Figma "Button" and "Icon button" components, shared by links and buttons.

const BUTTON_SIZE = {
  md: "h-10 gap-2 rounded-lg px-4 text-label-m",
  sm: "h-8 gap-1.5 rounded-md px-3 text-label-s",
};

const BUTTON_VARIANT = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary:
    "border border-border-strong bg-bg text-primary hover:border-border-hover hover:bg-surface-raised",
};

export function buttonClass(variant = "primary", size = "md") {
  return `inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors duration-150 ease-soft ${BUTTON_SIZE[size]} ${BUTTON_VARIANT[variant]}`;
}

export const iconButtonClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-bg text-primary transition-colors duration-150 ease-soft hover:border-border-hover hover:bg-surface-raised";
