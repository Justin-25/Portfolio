import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { profile } from "../content";
import { iconButtonClass } from "./ui";

// GitHub, LinkedIn (only once its URL is set in content.js) and email, as icon buttons.
// `only` picks a subset by key, e.g. ["github", "linkedin"] in the hero.
export default function SocialLinks({ className = "", only }) {
  const links = [
    { key: "github", href: profile.github, label: "GitHub", Icon: FaGithub, external: true },
    profile.linkedin && { key: "linkedin", href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedin, external: true },
    { key: "email", href: `mailto:${profile.email}`, label: "Email", Icon: LuMail },
  ].filter((link) => link && (!only || only.includes(link.key)));

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ href, label, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            className={iconButtonClass}
            {...(external && { target: "_blank", rel: "noreferrer" })}
          >
            <Icon aria-hidden="true" className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
