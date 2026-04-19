/**
 * @file Not found error class.
 * @module src/utils/errors/NotFoundError.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { ApplicationError } from './ApplicationError.js'
import { HTTP_STATUS } from '../../config/httpStatus.js'

/**
 * Error thrown when a requested resource is not found.
 */
export class NotFoundError extends ApplicationError {
  /**
   * @param {string} [message] - Error message.
   */
  constructor (message = 'The requested resource was not found.') {
    super(message, HTTP_STATUS.NOT_FOUND)
  }
}
