type RateLimitCheck = {
  allowed: boolean;
  reason?: "hourly" | "burst";
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const HOURLY_LIMIT = 10;
const BURST_LIMIT = 6;

const hourlyBuckets = new Map<string, Bucket>();
const burstBuckets = new Map<string, Bucket>();

let lastCleanupAt = 0;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    "unknown"
  );
}

function simpleHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function getClientKey(request: Request) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown-agent";

  return simpleHash(`${ip}|${userAgent}`);
}

function cleanupExpiredBuckets(now: number) {
  if (now - lastCleanupAt < 5 * MINUTE_MS) return;

  for (const [key, bucket] of hourlyBuckets.entries()) {
    if (bucket.resetAt <= now) {
      hourlyBuckets.delete(key);
    }
  }

  for (const [key, bucket] of burstBuckets.entries()) {
    if (bucket.resetAt <= now) {
      burstBuckets.delete(key);
    }
  }

  lastCleanupAt = now;
}

function getOrCreateBucket(
  buckets: Map<string, Bucket>,
  key: string,
  now: number,
  windowMs: number
) {
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const nextBucket = {
      count: 0,
      resetAt: now + windowMs
    };

    buckets.set(key, nextBucket);
    return nextBucket;
  }

  return current;
}

function makeRetryAfterSeconds(resetAt: number, now: number) {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

export function checkChatRateLimit(request: Request): RateLimitCheck {
  const now = Date.now();
  const key = getClientKey(request);

  cleanupExpiredBuckets(now);

  const burstBucket = getOrCreateBucket(burstBuckets, key, now, MINUTE_MS);

  if (burstBucket.count >= BURST_LIMIT) {
    return {
      allowed: false,
      reason: "burst",
      limit: BURST_LIMIT,
      remaining: 0,
      resetAt: burstBucket.resetAt,
      retryAfterSeconds: makeRetryAfterSeconds(burstBucket.resetAt, now)
    };
  }

  const hourlyBucket = getOrCreateBucket(hourlyBuckets, key, now, HOUR_MS);

  if (hourlyBucket.count >= HOURLY_LIMIT) {
    return {
      allowed: false,
      reason: "hourly",
      limit: HOURLY_LIMIT,
      remaining: 0,
      resetAt: hourlyBucket.resetAt,
      retryAfterSeconds: makeRetryAfterSeconds(hourlyBucket.resetAt, now)
    };
  }

  burstBucket.count += 1;
  hourlyBucket.count += 1;

  return {
    allowed: true,
    limit: HOURLY_LIMIT,
    remaining: Math.max(0, HOURLY_LIMIT - hourlyBucket.count),
    resetAt: hourlyBucket.resetAt,
    retryAfterSeconds: makeRetryAfterSeconds(hourlyBucket.resetAt, now)
  };
}

export function makeRateLimitHeaders(result: RateLimitCheck) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    "Retry-After": String(result.retryAfterSeconds)
  };
}
