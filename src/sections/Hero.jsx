import { LuArrowDown, LuDownload, LuGlobe, LuMapPin } from "react-icons/lu";
import avatar from "../assets/justin-avatar.webp";
import portrait from "../assets/justin-portrait.webp";
import Badge from "../components/Badge";
import SocialLinks from "../components/SocialLinks";
import { buttonClass } from "../components/ui";
import { profile } from "../content";

const PHOTO_ALT = "Justin Mandia smiling, seated at an outdoor café table";

// The thin "+" marks at the photo card's corners (Figma "Corner mark")
function CornerMark({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 13 13" className={`absolute size-3.25 text-muted ${className}`}>
      <path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Hero (Figma "Hero"). Phone and tablet: round avatar next to the badge.
// From 1024px: the photo card on the right. Both photos use lazy loading, so each screen
// size only downloads the one it shows (hidden lazy images are never fetched).
export default function Hero() {
  return (
    <section id="top" className="scroll-mt-14 md:scroll-mt-16">
      <div className="page-container flex items-center gap-20 pt-12 pb-18 md:pt-28 md:pb-32">
        <div className="min-w-0 flex-1 space-y-7 md:space-y-8">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={PHOTO_ALT}
              width="72"
              height="72"
              loading="lazy"
              className="size-18 rounded-full border border-border-strong object-cover grayscale contrast-[1.12] lg:hidden"
            />
            <Badge dot>{profile.status}</Badge>
          </div>

          <div className="space-y-2 md:space-y-3">
            <h1 className="text-display-m text-balance text-primary md:max-w-160 md:text-display-xl">
              {profile.name}
            </h1>
            <p className="text-heading-m text-secondary md:text-heading-l">{profile.role}</p>
          </div>

          <p className="max-w-140 text-body-m text-secondary md:text-body-l">{profile.intro}</p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#projects" className={`${buttonClass("primary")} flex-1 md:flex-none`}>
              View projects
              <LuArrowDown aria-hidden="true" className="size-4" />
            </a>
            <a href="#contact" className={`${buttonClass("secondary")} flex-1 md:flex-none`}>
              Contact me
            </a>
            {profile.cv && (
              <a href={profile.cv} download className={`${buttonClass("secondary")} basis-full md:basis-auto`}>
                <LuDownload aria-hidden="true" className="size-4" />
                Download CV
              </a>
            )}
            <div className="hidden items-center gap-3 md:flex">
              <span aria-hidden="true" className="h-6 w-px bg-border-strong" />
              <SocialLinks only={["github", "linkedin"]} />
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body-s text-muted md:gap-x-6">
            <li className="flex items-center gap-2">
              <LuMapPin aria-hidden="true" className="size-4" />
              {profile.location}
            </li>
            <li className="flex items-center gap-2">
              <LuGlobe aria-hidden="true" className="size-4" />
              {profile.availability}
            </li>
          </ul>
        </div>

        <div className="relative hidden shrink-0 lg:block">
          <div className="h-120 w-100 overflow-hidden rounded-2xl border border-border-strong">
            <img
              src={portrait}
              alt={PHOTO_ALT}
              width="400"
              height="480"
              loading="lazy"
              className="size-full object-cover grayscale contrast-[1.12]"
            />
          </div>
          <CornerMark className="-top-1.5 -left-1.5" />
          <CornerMark className="-top-1.5 -right-1.5" />
          <CornerMark className="-bottom-1.5 -left-1.5" />
          <CornerMark className="-right-1.5 -bottom-1.5" />
        </div>
      </div>
    </section>
  );
}
