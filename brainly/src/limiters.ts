import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const questionLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.userid ?? ipKeyGenerator(req.ip ?? "nothing"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "you can only ask 10 questions per hour.",
  },
});
export const contentaddLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 15,
  keyGenerator: (req) => req.userid ?? ipKeyGenerator(req.ip ?? "nothing"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "you can only add 15 content pieces per hour",
  },
});
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  keyGenerator: (req) => req.userid ?? ipKeyGenerator(req.ip ?? "nothing"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "maximum limit reached",
  },
});
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.userid ?? ipKeyGenerator(req.ip ?? "nothing"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "maximum limit reached",
  },
});
export const shareLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.userid ?? ipKeyGenerator(req.ip ?? "nothing"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "maximum limit reached,try again in 30 minutes",
  },
});
