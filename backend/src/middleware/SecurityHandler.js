/**
 * @file Security middleware using established libraries.
 * @module src/middleware/SecurityHandler.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 100

/**
 * Handles application security middleware.
 * Provides abstraction over third-party security libraries.
 */
export default class SecurityHandler {
  #rateLimiter

  constructor () {
    this.#rateLimiter = this.#createRateLimiter()
  }

  /**
   * Returns Helmet middleware with basic security headers.
   *
   * @returns {Function} Express middleware for security headers.
   */
  getSecurityHeadersMiddleware () {
    return helmet()
  }

  /**
   * Returns CORS middleware configured for the frontend client.
   *
   * @returns {Function} Express middleware for CORS.
   */
  getCorsMiddleware () {
    return cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    })
  }

  /**
   * Returns rate limiting middleware.
   *
   * @returns {Function} Express middleware for rate limiting.
   */
  getRateLimitMiddleware () {
    return this.#rateLimiter
  }

  /**
   * Configures rate limiter: 100 requests per 15 minutes per IP.
   *
   * @returns {Function} Express rate limiting middleware.
   */
  #createRateLimiter () {
    return rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Too Many Requests',
        message: 'Please try again later'
      }
    })
  }
}
