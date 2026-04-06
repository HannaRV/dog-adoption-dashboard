/**
 * @file Audit logging middleware for authentication events.
 * @module src/middleware/auditLog.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Logs authentication-related events.
 *
 * @param {string} event - Event type (e.g. 'LOGIN_SUCCESS', 'LOGIN_FAILURE').
 * @param {object} req - Express request object.
 * @param {object} [details] - Optional additional details.
 */
export const auditLog = (event, req, details = {}) => {
  console.log(JSON.stringify({
    event,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('user-agent'),
    ...details
  }))
}
