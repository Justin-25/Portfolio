import { useState } from "react";
import { LuArrowUpRight, LuAward, LuEye, LuGraduationCap } from "react-icons/lu";
import fullstackBootcamp from "../assets/certificates/fullstack-bootcamp.webp";
import nodejsBootcamp from "../assets/certificates/nodejs-bootcamp.webp";
import IconBox from "../components/IconBox";
import Modal from "../components/Modal";
import SectionHeading from "../components/SectionHeading";
import TagList from "../components/TagList";
import { buttonClass } from "../components/ui";
import { bio, education, motto, profile, sections, skills } from "../content";
import Section from "./Section";

const CERTIFICATES = { "nodejs-bootcamp": nodejsBootcamp, "fullstack-bootcamp": fullstackBootcamp };

// Shows one phrase of the paragraph in white
function Highlighted({ text, highlight }) {
  const start = text.indexOf(highlight);
  if (start === -1) return text;
  const end = start + highlight.length;
  return (
    <>
      {text.slice(0, start)}
      <span className="text-primary">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  );
}

// Figma "Education item". Phone: icon and date on top, then title, meta, link.
// From 768px: one row (date, icon, title and meta, link).
function EducationItem({ item, onViewCertificate }) {
  return (
    <li className="flex flex-col gap-2.5 border-t border-border py-5 md:flex-row md:items-center md:gap-6 md:py-6">
      <div className="flex items-center gap-3 md:contents">
        <IconBox
          icon={item.kind === "degree" ? LuGraduationCap : LuAward}
          size="size-9 md:size-11"
          className="md:order-2"
        />
        <time dateTime={item.dateTime} className="font-mono text-mono-s text-muted md:order-1 md:w-22 md:shrink-0">
          {item.date}
        </time>
      </div>
      <div className="min-w-0 space-y-1 md:order-3 md:flex-1">
        <p className="text-heading-s text-primary">{item.title}</p>
        <p className="text-body-s text-secondary">{item.meta}</p>
      </div>
      {item.certificate && (
        <button
          type="button"
          onClick={() => onViewCertificate(item)}
          aria-haspopup="dialog"
          // screen readers hear which course it is; the name still starts with the visible words
          aria-label={`View certificate: ${item.title}`}
          className="inline-flex items-center gap-1.5 self-start rounded-sm text-label-s text-secondary transition-colors duration-150 ease-soft hover:text-primary md:order-4 md:shrink-0 md:self-center"
        >
          View certificate
          <LuEye aria-hidden="true" className="size-4" />
        </button>
      )}
    </li>
  );
}

// Figma "Certificate viewer": the certificate image, and a button to Udemy's own certificate page
function CertificateViewer({ item, open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={item?.title}
      description={item && `${item.meta} · ${item.date}`}
      actions={
        item && (
          <>
            <button type="button" onClick={onClose} className={buttonClass("secondary")}>
              Close
            </button>
            <a href={item.certificateUrl} target="_blank" rel="noreferrer" className={buttonClass("primary")}>
              View on Udemy
              <LuArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </>
        )
      }
    >
      {item && (
        <img
          src={CERTIFICATES[item.certificate]}
          alt={`Udemy certificate of completion for “${item.title}”, awarded to ${profile.name} in ${item.date}`}
          width="1328"
          height="988"
          className="h-auto w-full rounded-lg border border-border"
        />
      )}
    </Modal>
  );
}

export default function About() {
  // The chosen course stays set while the viewer fades out, so its content doesn't vanish early
  const [certificate, setCertificate] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  function viewCertificate(item) {
    setCertificate(item);
    setViewerOpen(true);
  }

  return (
    <Section id="about" labelledBy="about-title">
      <div className="space-y-10 md:space-y-16">
        <SectionHeading id="about-title" {...sections.about} />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-5 md:space-y-6">
            {bio.map((p) => (
              <p key={p.highlight} className="text-body-m text-secondary md:text-body-l">
                <Highlighted {...p} />
              </p>
            ))}
            <blockquote className="border-l-2 border-border-strong py-0.5 pl-3.5 font-mono text-mono-s text-muted md:py-1 md:pl-4 md:text-mono-m">
              “{motto}”
            </blockquote>
          </div>

          <div className="space-y-6 rounded-2xl border border-border bg-surface px-5 py-6 md:space-y-7 md:p-8">
            {skills.map((group) => (
              <div key={group.group} className="space-y-3">
                <h3 className="eyebrow text-muted">{group.group}</h3>
                <TagList items={group.items} label={`${group.group} skills`} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h3 className="text-heading-m text-primary">Education & courses</h3>
          <ol className="border-b border-border">
            {education.map((item) => (
              <EducationItem key={item.title} item={item} onViewCertificate={viewCertificate} />
            ))}
          </ol>
        </div>
      </div>
      <CertificateViewer item={certificate} open={viewerOpen} onClose={() => setViewerOpen(false)} />
    </Section>
  );
}
