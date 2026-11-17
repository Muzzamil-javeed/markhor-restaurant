"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type RevealAs = "div" | "li";

/** Soft scroll reveal — IntersectionObserver, no Framer. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealAs;
}) {
  const Tag = as;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const id = window.requestAnimationFrame(() => setShown(true));
      return () => window.cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = {
    animationDelay: delay ? `${delay}s` : undefined,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      className={cn(shown && "animate-page-enter", !shown && "opacity-0", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
