/**
 * @file Express application configuration.
 * @module src/config/express.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import session from 'express-session'

import SecurityHandler from '../middleware/SecurityHandler.js'
import ErrorHandler from '../middleware/ErrorHandler.js'
import { router } from '../routes/router.js'

/**
 * Configures and manages the Express application.
 */
export default class ExpressApplication {
  #app
  #securityHandler
  #errorHandler

  /**
   * @param {SecurityHandler} [securityHandler] - Injected for testing.
   * @param {ErrorHandler} [errorHandler] - Injected for testing.
   */
  constructor (
    securityHandler = new SecurityHandler(),
    errorHandler = new ErrorHandler()
  ) {
    this.#app = express()
    this.#securityHandler = securityHandler
    this.#errorHandler = errorHandler
    this.#configureSecurity()
    this.#configureSession()
    this.#configureBodyParsing()
    this.#configureRoutes()
    this.#configureErrorHandling()
  }

  #configureSecurity () {
    this.#app.set('trust proxy', 1)
    this.#app.use(this.#securityHandler.getSecurityHeadersMiddleware())
    this.#app.use(this.#securityHandler.getCorsMiddleware())
    this.#app.use(this.#securityHandler.getRateLimitMiddleware())
  }

  #configureSession () {
    this.#app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    }))
  }

  #configureBodyParsing () {
    this.#app.use(express.json())
  }

  #configureRoutes () {
    this.#app.use('/', router)
  }

  #configureErrorHandling () {
    this.#app.use((err, req, res, next) =>
      this.#errorHandler.handle(err, req, res, next))
  }

  /**
   * Returns the Express application instance.
   *
   * @returns {object} Express application.
   */
  getApp () {
    return this.#app
  }
}
