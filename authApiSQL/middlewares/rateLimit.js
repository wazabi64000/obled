import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests. Please try again later.',
  },
  skipFailedRequests: true,
  keyGenerator: (req) => {
    // Utilise ipKeyGenerator pour IPv6 + ajout User-Agent
    const ip = ipKeyGenerator(req);
    return ip + (req.headers['user-agent'] || '');
  },
  handler: (req, res, next, options) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },

});

export default limiter;
