import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/**
 * Admin auth: signed httpOnly session cookie, or Bearer / x-admin-password
 * (kept for API tooling).
 */
export function assertAdmin(request: Request):
  | { ok: true }
  | { ok: false; status: 401 | 500; error: string } {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return {
      ok: false,
      status: 500,
      error: "ADMIN_PASSWORD is not configured.",
    };
  }

  const session = readCookie(request, ADMIN_SESSION_COOKIE);
  if (verifyAdminSessionToken(session)) {
    return { ok: true };
  }

  const headerPassword = request.headers.get("x-admin-password");
  const auth = request.headers.get("authorization");
  let provided: string | null = headerPassword;

  if (!provided && auth?.toLowerCase().startsWith("bearer ")) {
    provided = auth.slice(7).trim();
  }

  if (!provided || provided !== expected) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }

  return { ok: true };
}
