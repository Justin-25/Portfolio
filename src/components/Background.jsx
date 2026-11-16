import { useEffect, useRef } from "react";

const RADIUS = 330; // how far the lit grid reaches from the cursor (Figma "Spotlight mask")
const SIZE = RADIUS * 2.4; // the moving window also carries the soft glow, which reaches a bit further

// Page background (Figma "Background — grid + cursor spotlight").
// - A faint grid fixed behind the whole page.
// - With a mouse: a round window follows the cursor and shows a brighter copy of the grid plus a
//   soft glow. It moves with transform only: the window moves to the cursor, and the bright grid
//   inside it moves the opposite way, so its lines stay exactly on top of the faint ones.
// - Touch screens and "reduce motion": no spotlight, just a still glow at the top (index.css).
export default function Background() {
  const windowRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const spot = windowRef.current;
    const grid = gridRef.current;
    const canFollow = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    function place(x, y) {
      const dx = x - SIZE / 2;
      const dy = y - SIZE / 2;
      spot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      grid.style.transform = `translate3d(${-dx}px, ${-dy}px, 0)`;
    }

    // Start beside the name in the hero (as in Figma), then glide after the cursor
    place(window.innerWidth * 0.54, 420);
    const start = requestAnimationFrame(() => {
      spot.classList.add("spotlight-glide");
      grid.classList.add("spotlight-glide");
    });

    let frame = 0;
    let x = 0;
    let y = 0;
    function onPointerMove(e) {
      if (e.pointerType !== "mouse" || !canFollow.matches) return;
      x = e.clientX;
      y = e.clientY;
      // at most one update per screen refresh
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          place(x, y);
        });
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(start);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div
          ref={windowRef}
          data-testid="spotlight"
          className="spotlight absolute top-0 left-0 rounded-full bg-[radial-gradient(circle_closest-side,rgb(255_255_255/0.09),transparent)] will-change-transform"
          style={{ width: SIZE, height: SIZE }}
        >
          <div className="absolute inset-0 mask-[radial-gradient(circle_330px_at_center,#000,transparent)]">
            <div
              ref={gridRef}
              data-testid="spotlight-grid"
              className="bg-grid bg-grid-bright absolute top-0 left-0 h-screen w-screen will-change-transform"
            />
          </div>
        </div>
      </div>
      {/* The glow is wider than a phone screen, so its box clips it (no sideways scrolling) */}
      <div
        aria-hidden="true"
        data-testid="static-glow"
        className="static-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-95 overflow-hidden"
      >
        <div className="absolute -top-35 left-1/2 size-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_closest-side,rgb(255_255_255/0.08),transparent)]" />
      </div>
    </>
  );
}
