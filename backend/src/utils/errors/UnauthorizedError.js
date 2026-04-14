/**
 * @file Unauthorized error class.
 * @module src/utils/errors/UnauthorizedError.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { ApplicationError } from './ApplicationError.js'
import { HTTP_STATUS } from '../config/httpStatus.js'

/**
 * Error thrown when a user is not authenticated.
 */
export class UnauthorizedError extends ApplicationError {
  /**
   * @param {string} [message] - Error message.
   */
  constructor (message = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED)
  }
}
