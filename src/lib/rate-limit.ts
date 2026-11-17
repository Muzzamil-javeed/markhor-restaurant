type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory per-key rate limit (best-effort on a single Node process).
 * Returns ok:false when the limit is exceeded.
 */
export function rateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true; remaining: number } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const existing = buckets.get(input.key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(input.key, {
      count: 1,
      resetAt: now + input.windowMs,
    });
    return { ok: true, remaining: input.limit - 1 };
  }

  if (existing.count >= input.limit) {
    return { ok: false, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { ok: true, remaining: input.limit - existing.count };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
