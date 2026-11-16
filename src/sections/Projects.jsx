import SectionHeading from "../components/SectionHeading";
import { sections } from "../content";
import Section from "./Section";

// Projects (Figma "Projects"). Task 1: heading only; the project cards come in Task 2.
export default function Projects() {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading id="projects-title" {...sections.projects} />
    </Section>
  );
}
