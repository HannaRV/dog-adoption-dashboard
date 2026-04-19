/**
 * @file API error class for backend request failures.
 * @module src/utils/errors/ApiError.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Error thrown when a backend API request fails.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code from the failed response.
   */
  constructor (message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
