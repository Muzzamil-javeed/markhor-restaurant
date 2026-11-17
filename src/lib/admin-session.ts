import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "markhor_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

type SessionPayload = {
  v: 1;
  role: "admin";
  exp: number;
};

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "dev-admin-secret"
  );
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payloadB64: string): string {
  return createHmac("sha256", sessionSecret())
    .update(payloadB64)
    .digest("base64url");
}

export function createAdminSessionToken(
  now: Date = new Date(),
): string {
  const payload: SessionPayload = {
    v: 1,
    role: "admin",
    exp: now.getTime() + SESSION_TTL_MS,
  };
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifyAdminSessionToken(
  token: string | undefined | null,
  now: Date = new Date(),
): boolean {
  if (!token) return false;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  const expected = sign(payloadB64);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadB64)) as SessionPayload;
    if (payload.v !== 1 || payload.role !== "admin") return false;
    if (typeof payload.exp !== "number" || payload.exp < now.getTime()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Edge-safe verifier for proxy.ts (Web Crypto). */
export async function verifyAdminSessionTokenEdge(
  token: string | undefined | null,
  secret: string,
  nowMs: number = Date.now(),
): Promise<boolean> {
  if (!token || !secret) return false;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  const expected = bufferToBase64Url(signed);
  if (!timingSafeEqualStrings(signature, expected)) return false;

  try {
    const json = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    const payload = JSON.parse(json) as SessionPayload;
    return (
      payload.v === 1 &&
      payload.role === "admin" &&
      typeof payload.exp === "number" &&
      payload.exp >= nowMs
    );
  } catch {
    return false;
  }
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function adminCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Strict + httpOnly blocks classic CSRF cookie attachment on cross-site POSTs.
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
