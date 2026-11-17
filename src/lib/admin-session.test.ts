import { describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

describe("admin session", () => {
  it("creates a verifiable signed token", () => {
    const token = createAdminSessionToken(new Date("2026-11-16T12:00:00Z"));
    expect(verifyAdminSessionToken(token, new Date("2026-11-16T12:00:00Z"))).toBe(
      true,
    );
  });

  it("rejects tampered tokens", () => {
    const token = createAdminSessionToken();
    const [payload] = token.split(".");
    expect(verifyAdminSessionToken(`${payload}.tampered`)).toBe(false);
  });
});
