import { navLinks, profile } from "../content";
import SocialLinks from "./SocialLinks";

// Footer bottom bar. The GitHub activity graph is added above it in Task 4.
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="page-container py-8 md:py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="order-3 text-body-s text-muted md:order-1">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <ul className="order-2 flex gap-6 md:gap-7">
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
          <SocialLinks className="order-1 md:order-3" />
        </div>
      </div>
    </footer>
  );
}
