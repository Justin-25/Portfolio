import { useEffect, useRef } from "react";

// Fades its content in with a 16px rise the first time it scrolls into view (CLAUDE.md "Motion").
// - Only content that starts below the screen is hidden, and only by JavaScript, so nothing that
//   is already visible ever waits on an animation (and without JavaScript nothing is hidden).
// - With "reduce motion", nothing is hidden or moved.
// - `delay` staggers items in a list (capped by the caller).
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen

    el.classList.add("reveal-hidden");
    // Any part of it in view counts (a threshold like 15% could never be reached by a very tall block)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("reveal-hidden");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
