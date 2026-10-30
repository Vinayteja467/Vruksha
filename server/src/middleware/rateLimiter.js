// Production-grade in-memory sliding-window rate limiter (zero external dependencies)

class MemoryRateLimiter {
  constructor({ windowMs = 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) {
    this.windowMs = windowMs;
    this.max = max;
    this.message = message;
    this.hits = new Map();

    // Periodically sweep expired keys every 2 minutes
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.hits.entries()) {
        if (now - record.startTime > this.windowMs) {
          this.hits.delete(key);
        }
      }
    }, 2 * 60 * 1000);

    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  middleware() {
    return (req, res, next) => {
      // Extract client IP address (handles proxies and x-forwarded-for)
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '127.0.0.1');
      const now = Date.now();

      let record = this.hits.get(clientIp);

      if (!record || (now - record.startTime > this.windowMs)) {
        record = {
          startTime: now,
          count: 1
        };
        this.hits.set(clientIp, record);
      } else {
        record.count += 1;
      }

      const remaining = Math.max(0, this.max - record.count);
      const resetTime = new Date(record.startTime + this.windowMs);

      res.setHeader('X-RateLimit-Limit', this.max);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime.getTime() / 1000));

      if (record.count > this.max) {
        const retryAfterSeconds = Math.ceil((record.startTime + this.windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        return res.status(429).json({
          success: false,
          message: this.message,
          retryAfter: `${retryAfterSeconds}s`
        });
      }

      next();
    };
  }
}

// Strict limiter for sensitive authentication endpoints (prevent brute-force)
export const authRateLimiter = new MemoryRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 requests per 15 mins per IP
  message: 'Too many authentication attempts from this IP. Please wait 15 minutes before trying again.'
}).middleware();

// General API rate limiter
export const apiRateLimiter = new MemoryRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // max 120 requests per minute
  message: 'API rate limit exceeded. Please slow down your requests.'
}).middleware();
