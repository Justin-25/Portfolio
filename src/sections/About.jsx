import SectionHeading from "../components/SectionHeading";
import { sections } from "../content";
import Section from "./Section";

// About (Figma "About"). Task 1: heading only; bio, skills and education come in Task 2.
export default function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeading id="about-title" {...sections.about} />
    </Section>
  );
}
