/**
 * @file Middleware to require authentication via session.
 * @module src/middleware/requireAuthentication.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { HTTP_STATUS } from '../config/httpStatus.js'

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
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource.'
    })
  }
  next()
}
