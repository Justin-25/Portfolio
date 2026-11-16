import { FaGithub } from "react-icons/fa6";
import { LuArrowUpRight, LuCheck, LuShoppingBag } from "react-icons/lu";
import toothFairyHome from "../assets/tooth-fairy-home.webp";
import Badge from "../components/Badge";
import IconBox from "../components/IconBox";
import SectionHeading from "../components/SectionHeading";
import TagList from "../components/TagList";
import { buttonClass } from "../components/ui";
import { inProgress, projects, sections } from "../content";
import Section from "./Section";

const IMAGES = { "tooth-fairy-home": toothFairyHome };
const newTab = { target: "_blank", rel: "noreferrer" };

// The project's screenshot inside a simple browser window (Figma "Browser")
function BrowserFrame({ url, image, alt }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border-strong bg-bg shadow-[0_16px_40px_rgb(0_0_0/0.5)] lg:rounded-[10px]">
      <div className="flex items-center gap-1.25 border-b border-border bg-surface-raised px-2.5 py-1.75 lg:gap-1.5 lg:px-3 lg:py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} aria-hidden="true" className="size-1.5 rounded-full bg-border-strong lg:size-2" />
        ))}
        <span className="ml-1.5 hidden flex-1 truncate rounded-md bg-bg px-2.5 py-0.5 font-mono text-mono-s text-muted lg:block">
          {url}
        </span>
      </div>
      <img
        src={image}
        alt={alt}
        width="1152"
        height="720"
        loading="lazy"
        className="aspect-[16/10] w-full object-cover"
      />
    </div>
  );
}

function FeaturedProject({ project }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface lg:flex">
      <div className="flex items-center justify-center border-b border-border bg-surface-raised p-4 lg:w-160 lg:shrink-0 lg:border-r lg:border-b-0 lg:p-8">
        <BrowserFrame
          url={new URL(project.liveUrl).host}
          image={IMAGES[project.image]}
          alt={project.imageAlt}
        />
      </div>

      <div className="flex flex-col justify-center gap-4 px-5 py-6 lg:gap-5 lg:p-10">
        <Badge className="self-start">{project.label}</Badge>
        <div className="space-y-2">
          <h3 className="text-heading-m text-primary lg:text-heading-l">{project.name}</h3>
          <p className="text-body-m text-secondary">{project.description}</p>
        </div>
        <ul className="space-y-2.5">
          {project.highlights.map((item) => (
            <li key={item} className="flex gap-2.5 text-body-s text-secondary">
              <LuCheck aria-hidden="true" className="mt-0.75 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
        <TagList items={project.tech} label="Built with" />
        <div className="flex gap-3">
          <a href={project.liveUrl} {...newTab} className={`${buttonClass("primary")} flex-1 lg:flex-none`}>
            Live demo
            <LuArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <a href={project.codeUrl} {...newTab} className={`${buttonClass("secondary")} flex-1 lg:flex-none`}>
            <FaGithub aria-hidden="true" className="size-4" />
            View code
          </a>
        </div>
      </div>
    </article>
  );
}

// Dashed card for the project I'm building now (Figma "Project card / Currently building")
function InProgressProject({ project }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-dashed border-border-strong bg-bg px-5 py-6 lg:flex-row lg:items-center lg:gap-6 lg:p-8">
      <div className="flex items-center gap-3 lg:contents">
        <IconBox icon={LuShoppingBag} size="size-11 lg:size-14" />
        <p className="eyebrow text-muted lg:hidden">Currently building</p>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="eyebrow hidden text-muted lg:block">Currently building</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-heading-m text-primary">{project.name}</h3>
          <Badge dot>In progress</Badge>
        </div>
        <p className="text-body-m text-secondary">{project.description}</p>
      </div>
      <a href={project.codeUrl} {...newTab} className={`${buttonClass("secondary")} w-full lg:w-auto`}>
        <FaGithub aria-hidden="true" className="size-4" />
        Follow on GitHub
        <LuArrowUpRight aria-hidden="true" className="size-4" />
      </a>
    </article>
  );
}

export default function Projects() {
  const [featured] = projects;
  return (
    <Section id="projects" labelledBy="projects-title">
      <div className="space-y-8 md:space-y-12">
        <SectionHeading id="projects-title" {...sections.projects} />
        <FeaturedProject project={featured} />
        <InProgressProject project={inProgress} />
      </div>
    </Section>
  );
}
