"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/** Soft magnetic pull toward cursor — desktop / fine pointer only. */
export function HeroMagneticCta({
  children,
  className,
  strength = 0.28,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      !reduce &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, [reduce]);

  const onMove = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      const el = wrapRef.current;
      if (!el || !enabled.current) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    [strength],
  );

  const onLeave = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  }, []);

  return (
    <span
      ref={wrapRef}
      data-hero-cta
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ display: "inline-flex", willChange: "transform" }}
    >
      {children}
    </span>
  );
}
