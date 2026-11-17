"use client";

/** Tiny rising ember dots — preloader only. CSS-driven. */
export function Embers() {
  const dots = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((i) => (
        <span
          key={i}
          className="animate-ember absolute bottom-0 rounded-full bg-[#e87830]"
          style={{
            left: `${6 + ((i * 17) % 88)}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            animationDelay: `${(i % 9) * 0.35}s`,
            animationDuration: `${7 + (i % 5)}s`,
            opacity: 0.35 + (i % 4) * 0.1,
          }}
        />
      ))}
    </div>
  );
}
