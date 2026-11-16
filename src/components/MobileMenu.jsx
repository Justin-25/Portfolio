import { useEffect, useRef } from "react";
import { LuArrowRight, LuX } from "react-icons/lu";
import { navLinks } from "../content";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { buttonClass, iconButtonClass } from "./ui";

// Phone menu (Figma "States / Phone — menu open"). A native <dialog>: showModal() traps focus,
// makes the page behind it inert and handles Esc; focus returns to the menu button on close.
export default function MobileMenu({ open, onClose }) {
  const ref = useRef(null);
  const closeRef = useRef(null);

  // showModal()/close() are browser methods, so `open` is synced to the element in an effect.
  // Focus goes to Close on open. (React's autoFocus fires while the dialog is still hidden and
  // never sets the HTML autofocus attribute, so showModal() would focus the logo link instead.)
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Any link inside closes the menu; the browser then follows it to its section
  function handleClick(e) {
    if (e.target.closest("a")) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-label="Menu"
      // React state decides when it closes, so stop the browser closing it on Esc by itself
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="modal m-0 h-dvh max-h-none w-full max-w-none bg-bg text-primary md:hidden"
    >
      <div onClick={handleClick} className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={iconButtonClass}
          >
            <LuX aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav className="px-6 pt-4">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center justify-between border-b border-border py-4.5 text-heading-m text-primary"
                >
                  {link.label}
                  <LuArrowRight aria-hidden="true" className="size-4 text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4 px-6 pt-8">
          <a href="#contact" className={`${buttonClass("primary")} w-full`}>
            Get in touch
          </a>
          <SocialLinks />
        </div>
      </div>
    </dialog>
  );
}
