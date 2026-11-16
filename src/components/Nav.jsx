import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { LuMenu } from "react-icons/lu";
import { navLinks, profile } from "../content";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { buttonClass, iconButtonClass } from "./ui";

// Sticky top bar (Figma "Nav"): links and buttons from 768px up, a menu button below that.
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // If the window grows to desktop width while the phone menu is open, close it
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/72 backdrop-blur-md">
        <div className="page-container flex h-14 items-center justify-between md:h-16">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-body-s text-secondary transition-colors duration-150 ease-soft hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={iconButtonClass}
              >
                <FaGithub aria-hidden="true" className="size-4" />
              </a>
              <a href="#contact" className={buttonClass("primary", "sm")}>
                Get in touch
              </a>
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className={`${iconButtonClass} md:hidden`}
          >
            <LuMenu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
