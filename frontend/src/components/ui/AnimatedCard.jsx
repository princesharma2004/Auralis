import React, { useRef, useState, useEffect } from "react";
import "./AnimatedCard.css"; // small CSS for perspective & glare

/**
 * AnimatedCard
 * Props:
 *  - title (string)
 *  - subtitle (string)
 *  - accent (string) // tailwind color class for accent, e.g. 'from-indigo-400 to-sky-300'
 *  - children (node) optional content
 *  - delay (number) optional entrance delay in ms
 */
export default function AnimatedCard({
  title,
  subtitle,
  accent = "from-indigo-400 to-sky-300",
  children,
  delay = 0,
}) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Entrance animation via IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  // Mouse move tilt
  const handleMove = (e) => {
    const el = containerRef.current;
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top; // y position within element
    const px = x / rect.width - 0.5; // -0.5 -> 0.5
    const py = y / rect.height - 0.5;

    const rotateY = px * 10; // degrees
    const rotateX = -py * 8; // degrees

    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;

    // Glare positioning
    if (glare) {
      const glareX = px * 50; // adjust intensity
      const glareY = py * 50;
      glare.style.transform = `translate(${glareX}%, ${glareY}%)`;
      glare.style.opacity = `${Math.min(0.7, Math.abs(px) + Math.abs(py))}`;
    }
  };

  const handleLeave = () => {
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (inner) {
      inner.style.transition = "transform 450ms cubic-bezier(.2,.9,.3,1)";
      inner.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
      // remove transition after end so moves are snappy again
      setTimeout(() => (inner.style.transition = ""), 460);
    }
    if (glare) {
      glare.style.transition = "opacity 450ms ease, transform 450ms ease";
      glare.style.opacity = "0";
      setTimeout(() => (glare.style.transition = ""), 460);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`animated-card w-full max-w-xl mx-auto`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={handleLeave}
      aria-hidden={false}
    >
      <div
        ref={innerRef}
        className={`card-inner rounded-2xl p-6 md:p-8 shadow-xl border border-white/6 bg-gradient-to-b from-white/3 to-white/2 will-change-transform ${
          visible ? "card-visible" : "card-hidden"
        }`}
        style={{ perspective: 1000 }}
      >
        {/* Glare layer */}
        <div
          ref={glareRef}
          className="card-glare rounded-2xl pointer-events-none"
        />

        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}
            >
              {/* accent label */}
              AI MATCH
            </div>

            <h3 className="mt-4 text-xl md:text-2xl font-semibold text-slate-100">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-300 max-w-xl">{subtitle}</p>
            )}
          </div>

          <div className="flex-shrink-0">
            {/* small decorative dot */}
            <span className="w-12 h-12 rounded-lg bg-gradient-to-tr from-white/6 to-white/3 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-sky-300"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2v6M5 8l7 6 7-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {children && (
          <div className="mt-5 text-sm text-slate-300">{children}</div>
        )}
      </div>
    </div>
  );
}
