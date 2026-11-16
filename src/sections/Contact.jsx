import { sections } from "../content";
import Section from "./Section";

// Contact (Figma "Contact"). Task 1: heading only; contact links and the form come in Task 3.
export default function Contact() {
  const { eyebrow, title, titleMuted, description } = sections.contact;
  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="max-w-140 space-y-3 md:space-y-4">
        <p className="eyebrow text-muted">{eyebrow}</p>
        <h2 id="contact-title" className="text-heading-l text-primary md:text-display-l">
          {title} <span className="block text-muted">{titleMuted}</span>
        </h2>
        <p className="text-body-m text-secondary md:text-body-l">{description}</p>
      </div>
    </Section>
  );
}
