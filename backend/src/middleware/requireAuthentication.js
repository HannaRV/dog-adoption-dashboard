/**
 * @file Middleware to require authentication via session.
 * @module src/middleware/requireAuth.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Middleware that requires an authenticated session.
 * Redirects to login if no session exists.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const requireAuthentication = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource.'
    })
  }
  next()
}
