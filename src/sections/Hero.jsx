import { profile } from "../content";

// Hero (Figma "Hero"). Task 1: name and role only; badge, intro, buttons and photo come in Task 2.
export default function Hero() {
  return (
    <section id="top" className="scroll-mt-14 md:scroll-mt-16">
      <div className="page-container pt-12 pb-18 md:pt-28 md:pb-32">
        <h1 className="text-display-m text-balance text-primary md:max-w-160 md:text-display-xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-heading-m text-secondary md:mt-3 md:text-heading-l">
          {profile.role}
        </p>
      </div>
    </section>
  );
}
