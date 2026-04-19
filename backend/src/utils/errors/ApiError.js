/**
 * @file Upstream API error class.
 * @module src/utils/errors/ApiError.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { ApplicationError } from './ApplicationError.js'

/**
 * Error thrown when an upstream API request fails.
 */
export class ApiError extends ApplicationError {
  /**
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code from the upstream response.
   */
  constructor (message, status) {
    super(message, status)
  }
}