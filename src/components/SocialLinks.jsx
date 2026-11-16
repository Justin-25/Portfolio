import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { profile } from "../content";
import { iconButtonClass } from "./ui";

// GitHub, LinkedIn (only once its URL is set in content.js) and email, as icon buttons.
export default function SocialLinks({ className = "" }) {
  const links = [
    { href: profile.github, label: "GitHub", Icon: FaGithub, external: true },
    profile.linkedin && { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedin, external: true },
    { href: `mailto:${profile.email}`, label: "Email", Icon: LuMail },
  ].filter(Boolean);

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
