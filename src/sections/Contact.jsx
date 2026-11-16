import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuMail, LuMapPin } from "react-icons/lu";
import ContactForm from "../components/ContactForm";
import IconBox from "../components/IconBox";
import Reveal from "../components/Reveal";
import { stagger } from "../components/ui";
import { profile, sections } from "../content";
import Section from "./Section";

// Figma "Contact item": icon tile, small label, value. A link when it has somewhere to go.
function ContactItem({ icon, label, value, href, external }) {
  const content = (
    <>
      <IconBox icon={icon} size="size-10" iconSize="size-4" rounded="rounded-lg" />
      <span className="min-w-0">
        <span className="block font-mono text-mono-s text-muted">{label}</span>
        <span className="block text-label-m break-words text-primary transition-colors duration-150 ease-soft group-hover:text-accent-hover">
          {value}
        </span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external && { target: "_blank", rel: "noreferrer" })}
          className="group flex items-center gap-3.5 rounded-lg"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-3.5">{content}</div>
      )}
    </li>
  );
}

// Contact (Figma "Contact"): heading and ways to reach me on the left, the form on the right.
export default function Contact() {
  const { eyebrow, title, titleMuted, description } = sections.contact;
  const items = [
    { icon: LuMail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.linkedin && { icon: FaLinkedin, label: "LinkedIn", value: "LinkedIn profile", href: profile.linkedin, external: true },
    { icon: FaGithub, label: "GitHub", value: profile.github.replace("https://", ""), href: profile.github, external: true },
    { icon: LuMapPin, label: "Location", value: `${profile.location} · Open to remote` },
  ].filter(Boolean);

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
        <Reveal className="space-y-8 md:space-y-10">
          <div className="space-y-3 md:space-y-4">
            <p className="eyebrow text-muted">{eyebrow}</p>
            <h2 id="contact-title" className="text-heading-l text-primary md:text-display-l">
              {title} <span className="block text-muted">{titleMuted}</span>
            </h2>
            <p className="text-body-m text-secondary md:text-body-l">{description}</p>
          </div>
          <ul className="space-y-4 md:space-y-5">
            {items.map((item) => (
              <ContactItem key={item.label} {...item} />
            ))}
          </ul>
        </Reveal>
        <Reveal delay={stagger(1)}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
