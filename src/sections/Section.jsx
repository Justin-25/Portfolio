// A page section with its anchor id. scroll-mt keeps its top below the sticky nav (56px / 64px).
export default function Section({ id, labelledBy, children }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="scroll-mt-14 md:scroll-mt-16">
      <div className="page-container py-18 md:py-30">{children}</div>
    </section>
  );
}
