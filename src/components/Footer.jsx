import { navLinks, profile } from "../content";
import GitHubActivity from "./GitHubActivity";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";

// Footer (Figma "Footer"): my GitHub activity, then the bottom bar (©, links, icons).
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="page-container space-y-10 pt-14 pb-8 md:space-y-14 md:pt-18 md:pb-10">
        <Reveal>
          <GitHubActivity />
        </Reveal>
        <div className="flex flex-col gap-5 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
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
