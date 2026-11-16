import { useEffect, useId, useRef } from "react";
import { LuCircleAlert, LuCircleCheck, LuX } from "react-icons/lu";

// The round icon above the title of a result modal
function ToneIcon({ tone }) {
  const error = tone === "error";
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 shrink-0 place-items-center rounded-full border bg-surface-raised ${error ? "border-danger text-danger" : "border-border-strong text-primary"}`}
    >
      {error ? <LuCircleAlert className="size-5" /> : <LuCircleCheck className="size-6" />}
    </span>
  );
}

// Shared Modal (Figma "Shared Modal" and "Certificate viewer"). A native <dialog> opened with
// showModal(): focus stays inside, the page behind is inert, and Esc, ✕ or a click on the
// backdrop closes it. Focus returns to whatever opened it.
// - tone "success" / "error": the result of an action (e.g. sending the form). The icon sits
//   above the title and screen readers treat it as an alert.
// - no tone: a plain dialog with the title at the top (e.g. the certificate viewer).
export default function Modal({ open, onClose, title, description, tone, size = "sm", actions, children }) {
  const ref = useRef(null);
  const id = useId();

  // showModal()/close() are browser methods, so `open` is synced to the element in an effect
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const heading = (
    <div className="min-w-0 space-y-1.5">
      <h2 id={`${id}-title`} className="text-heading-s text-primary">
        {title}
      </h2>
      {description && (
        <div id={`${id}-description`} className="text-body-s text-secondary">
          {description}
        </div>
      )}
    </div>
  );

  return (
    <dialog
      ref={ref}
      role={tone ? "alertdialog" : "dialog"}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      // React state decides when it closes, so stop the browser closing it on Esc by itself
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // a click on the dialog itself (not the content inside it) is a click on the backdrop
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`modal m-auto w-[calc(100%-32px)] rounded-2xl border border-border bg-surface text-primary shadow-[0_24px_60px_rgb(0_0_0/0.6)] ${size === "lg" ? "max-w-180" : "max-w-105"}`}
    >
      <div className="space-y-4 p-5 md:space-y-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          {tone ? <ToneIcon tone={tone} /> : heading}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-m-1 shrink-0 rounded-md p-1 text-muted transition-colors duration-150 ease-soft hover:text-primary"
          >
            <LuX aria-hidden="true" className="size-5" />
          </button>
        </div>
        {tone && heading}
        {children}
        {actions && (
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:justify-end">{actions}</div>
        )}
      </div>
    </dialog>
  );
}
