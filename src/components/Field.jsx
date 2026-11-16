import { LuCircleAlert } from "react-icons/lu";

// Figma "Field": a label, an input (or a textarea with `multiline`) and an error under it.
// The error is linked to the input (aria-describedby), so screen readers read it with the field.
export default function Field({ id, label, error, multiline = false, className = "", ...inputProps }) {
  const errorId = `${id}-error`;
  const Control = multiline ? "textarea" : "input";

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-label-m text-primary">
        {label}
      </label>
      <Control
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
        className={`block w-full rounded-lg border bg-surface px-3.5 text-body-s text-primary transition-colors duration-150 ease-soft placeholder:text-muted focus:outline-none read-only:opacity-70 ${
          multiline ? "h-35 resize-y py-2.75" : "h-11"
        } ${
          error
            ? "border-danger shadow-[0_0_0_3px_rgb(255_97_102/0.2)]"
            : "border-border-strong focus:border-secondary focus:shadow-[0_0_0_3px_rgb(255_255_255/0.14)]"
        }`}
      />
      {error && (
        <p id={errorId} className="flex gap-1.5 text-body-s text-danger">
          <LuCircleAlert aria-hidden="true" className="mt-0.75 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
