"use client";

import { useEffect, useRef, type RefObject } from "react";

const HEADER_H_VAR = "--header-h";

/** Keep --header-h in sync with the real sticky header (includes mobile nav). */
export function useHeaderHeightVar(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const apply = () => {
      const height = Math.ceil(node.getBoundingClientRect().height);
      document.documentElement.style.setProperty(HEADER_H_VAR, `${height}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("orientationchange", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", apply);
    };
  }, [ref]);
}

/** Drop-in for server headers: measures the closest sticky header ancestor. */
export function HeaderHeightSync() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const marker = ref.current;
    const node = marker?.closest("header");
    if (!node) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const height = Math.ceil(node.getBoundingClientRect().height);
      const prev = document.documentElement.style.getPropertyValue(HEADER_H_VAR);
      const next = `${height}px`;
      if (prev !== next) {
        document.documentElement.style.setProperty(HEADER_H_VAR, next);
      }
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    apply();
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    window.addEventListener("orientationchange", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={ref} className="hidden" aria-hidden />;
}
