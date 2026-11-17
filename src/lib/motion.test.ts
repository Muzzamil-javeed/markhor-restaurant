import { describe, expect, it } from "vitest";
import {
  INITIAL_PHASE,
  isAdminPath,
  labelForHref,
  shouldInterceptNavigation,
  transitionReducer,
} from "@/lib/motion";

describe("transitionReducer", () => {
  it("idle -> covering -> covered -> revealing -> idle", () => {
    let state = INITIAL_PHASE;
    state = transitionReducer(state, {
      type: "START_COVER",
      href: "/menu",
      label: "Menu",
    });
    expect(state.phase).toBe("covering");
    state = transitionReducer(state, { type: "COVER_DONE" });
    expect(state.phase).toBe("covered");
    state = transitionReducer(state, { type: "ROUTE_READY" });
    expect(state.phase).toBe("revealing");
    state = transitionReducer(state, { type: "REVEAL_DONE" });
    expect(state).toEqual(INITIAL_PHASE);
  });

  it("FORCE_IDLE clears mid-transition", () => {
    let state = transitionReducer(INITIAL_PHASE, {
      type: "START_COVER",
      href: "/cart",
      label: "Cart",
    });
    state = transitionReducer(state, { type: "FORCE_IDLE" });
    expect(state.phase).toBe("idle");
  });

  it("queues latest href while covering", () => {
    let state = transitionReducer(INITIAL_PHASE, {
      type: "START_COVER",
      href: "/menu",
      label: "Menu",
    });
    state = transitionReducer(state, {
      type: "START_COVER",
      href: "/cart",
      label: "Cart",
    });
    expect(state.href).toBe("/cart");
    expect(state.phase).toBe("covering");
  });
});

describe("shouldInterceptNavigation", () => {
  const base = {
    href: "/menu",
    currentPath: "/",
    currentSearch: "",
    button: 0,
  };

  it("allows normal left click", () => {
    expect(shouldInterceptNavigation(base)).toBeNull();
  });

  it("excludes modifier keys", () => {
    expect(shouldInterceptNavigation({ ...base, metaKey: true })).toBe(
      "modifier",
    );
    expect(shouldInterceptNavigation({ ...base, ctrlKey: true })).toBe(
      "modifier",
    );
  });

  it("excludes external, blank, hash, same, admin", () => {
    expect(
      shouldInterceptNavigation({
        ...base,
        href: "https://example.com",
      }),
    ).toBe("external");
    expect(shouldInterceptNavigation({ ...base, target: "_blank" })).toBe(
      "blank",
    );
    expect(shouldInterceptNavigation({ ...base, href: "#visit" })).toBe(
      "hash",
    );
    expect(
      shouldInterceptNavigation({
        ...base,
        href: "/",
        currentPath: "/",
      }),
    ).toBe("same");
    expect(
      shouldInterceptNavigation({
        ...base,
        href: "/admin/orders",
      }),
    ).toBe("admin");
  });
});

describe("helpers", () => {
  it("labels routes", () => {
    expect(labelForHref("/menu")).toBe("Menu");
    expect(labelForHref("/track")).toBe("Track order");
  });

  it("detects admin paths", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/login")).toBe(true);
    expect(isAdminPath("/menu")).toBe(false);
  });
});
