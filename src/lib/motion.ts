/** Central motion timings — tweak here only. */
export const MOTION = {
  preloader: { min: 1800, max: 3000, letterStagger: 0.06, exit: 0.9 },
  curtain: { cover: 0.45, reveal: 0.45, ease: [0.76, 0, 0.24, 1] as const },
  pageIn: { duration: 0.5, stagger: 0.08, y: 24 },
  adminFade: 0.15,
} as const;

export type TransitionPhase =
  | "idle"
  | "covering"
  | "covered"
  | "revealing";

export type NavigateExclusionReason =
  | "modifier"
  | "external"
  | "hash"
  | "same"
  | "admin"
  | "blank"
  | "download"
  | "non-left";

export function labelForHref(href: string): string {
  const path = href.split("?")[0]?.split("#")[0] || "/";
  const map: Record<string, string> = {
    "/": "Home",
    "/menu": "Menu",
    "/cart": "Cart",
    "/checkout": "Checkout",
    "/track": "Track order",
    "/contact": "Contact",
    "/terms": "Terms",
    "/privacy": "Privacy",
  };
  if (map[path]) return map[path];
  if (path.startsWith("/order")) return "Order";
  if (path.startsWith("/admin")) return "Admin";
  return "Markhor";
}

export function isAdminPath(href: string): boolean {
  const path = href.split("?")[0]?.split("#")[0] || "/";
  return path === "/admin" || path.startsWith("/admin/");
}

export function shouldInterceptNavigation(input: {
  href: string;
  currentPath: string;
  currentSearch?: string;
  target?: string | null;
  download?: boolean;
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}): NavigateExclusionReason | null {
  if (input.button !== undefined && input.button !== 0) return "non-left";
  if (input.metaKey || input.ctrlKey || input.shiftKey || input.altKey) {
    return "modifier";
  }
  if (input.target === "_blank") return "blank";
  if (input.download) return "download";

  const raw = input.href.trim();
  if (!raw || raw.startsWith("#")) return "hash";
  if (
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("sms:")
  ) {
    return "external";
  }
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (typeof window === "undefined") return "external";
      if (url.origin !== window.location.origin) return "external";
    } catch {
      return "external";
    }
  }

  if (raw.includes("#") && !raw.startsWith("/") && !raw.startsWith("http")) {
    return "hash";
  }
  const hashIndex = raw.indexOf("#");
  const withoutHash = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
  if (hashIndex >= 0 && (withoutHash === "" || withoutHash === input.currentPath)) {
    return "hash";
  }

  let nextPath = withoutHash.split("?")[0] || "/";
  let nextSearch = "";
  if (withoutHash.includes("?")) {
    nextSearch = `?${withoutHash.split("?")[1]}`;
  }
  if (/^https?:\/\//i.test(withoutHash) && typeof window !== "undefined") {
    try {
      const url = new URL(withoutHash);
      nextPath = url.pathname;
      nextSearch = url.search;
    } catch {
      return "external";
    }
  }

  const currentSearch = input.currentSearch || "";
  if (nextPath === input.currentPath && nextSearch === currentSearch) {
    return "same";
  }
  if (isAdminPath(nextPath) || isAdminPath(input.currentPath)) return "admin";

  return null;
}

export type PhaseEvent =
  | { type: "START_COVER"; href: string; label: string }
  | { type: "COVER_DONE" }
  | { type: "ROUTE_READY" }
  | { type: "REVEAL_DONE" }
  | { type: "FORCE_IDLE" };

export type PhaseState = {
  phase: TransitionPhase;
  href: string | null;
  label: string | null;
};

export const INITIAL_PHASE: PhaseState = {
  phase: "idle",
  href: null,
  label: null,
};

export function transitionReducer(
  state: PhaseState,
  event: PhaseEvent,
): PhaseState {
  switch (event.type) {
    case "START_COVER":
      if (state.phase === "covering" || state.phase === "covered") {
        return { ...state, href: event.href, label: event.label };
      }
      return {
        phase: "covering",
        href: event.href,
        label: event.label,
      };
    case "COVER_DONE":
      if (state.phase !== "covering") return state;
      return { ...state, phase: "covered" };
    case "ROUTE_READY":
      if (state.phase !== "covered" && state.phase !== "covering") return state;
      return { ...state, phase: "revealing" };
    case "REVEAL_DONE":
    case "FORCE_IDLE":
      return INITIAL_PHASE;
    default:
      return state;
  }
}

export const PRELOADER_STORAGE_KEY = "mk_preloader_seen";

export function readPreloaderSeen(): boolean {
  try {
    return sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function writePreloaderSeen(): void {
  try {
    sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}
