// Figma "Section heading": eyebrow, title and an optional description.
// Phone uses Heading/L + Body/M; from 768px up, Display/L + Body/L.
export default function SectionHeading({ id, eyebrow, title, description }) {
  return (
    <div className="max-w-180 space-y-3 md:space-y-4">
      <p className="eyebrow text-muted">{eyebrow}</p>
      <h2 id={id} className="text-heading-l text-primary md:text-display-l">
        {title}
      </h2>
      {description && (
        <p className="text-body-m text-secondary md:text-body-l">{description}</p>
      )}
    </div>
  );
}
