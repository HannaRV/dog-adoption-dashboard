/**
 * @file Centralized error handling middleware.
 * @module src/middleware/ErrorHandler.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

class ErrorLogger {
  /**
   * @param {Error} error - Error object.
   * @param {object} req - Express request object.
   */
  log (error, req) {
    console.error('Error occurred:', {
      message: error.message,
      stack: this.#isDevelopment() ? error.stack : undefined,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    })
  }

  #isDevelopment () {
    return process.env.NODE_ENV === 'development'
  }
}

class ErrorClassifier {
  /**
   * @param {Error} error - Error object.
   * @returns {{ status: number, type: string, message: string }} Error response details.
   */
  classify (error) {
    return {
      status: error.status || 500,
      type: error.name || 'InternalServerError',
      message: this.#isProduction() ? 'Something went wrong' : error.message
    }
  }

  #isProduction () {
    return process.env.NODE_ENV === 'production'
  }
}

class ErrorResponder {
  /**
   * @param {object} res - Express response object.
   * @param {{ status: number, type: string, message: string }} errorResponse - Classified error response.
   */
  respond (res, errorResponse) {
    res.status(errorResponse.status).json({
      error: errorResponse.type,
      message: errorResponse.message
    })
  }
}

/**
 * Main error handler for the application.
 * Delegates to ErrorLogger, ErrorClassifier and ErrorResponder.
 */
export default class ErrorHandler {
  #logger
  #classifier
  #responder

  constructor () {
    this.#logger = new ErrorLogger()
    this.#classifier = new ErrorClassifier()
    this.#responder = new ErrorResponder()
  }

  /**
   * Handles all application errors.
   *
   * @param {Error} error - Error object.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  handle (error, req, res, next) {
    if (res.headersSent) {
      return next(error)
    }

    this.#logger.log(error, req)
    const errorResponse = this.#classifier.classify(error)
    this.#responder.respond(res, errorResponse)
  }
}
