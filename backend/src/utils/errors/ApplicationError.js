/**
 * @file Base application error class.
 * @module src/utils/errors/ApplicationError.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Base error class for application errors.
 */
export class ApplicationError extends Error {
  /**
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code.
   */
  constructor (message, status) {
    super(message)
    this.status = status
    this.name = this.constructor.name
  }
}
