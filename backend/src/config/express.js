/**
 * @file Express application configuration.
 * @module src/config/express.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import SecurityHandler from '../middleware/SecurityHandler.js'
import ErrorHandler from '../middleware/ErrorHandler.js'
import { createRouter } from '../routes/router.js'

import { TokenService } from '../services/TokenService.js'
import { DogApiClient } from '../services/DogApiClient.js'
import { DogService } from '../services/DogService.js'
import { DogController } from '../controllers/DogController.js'
import { DogRouter } from '../routes/DogRouter.js'

import { OAuthService } from '../services/OAuthService.js'
import { AuditLogger } from '../utils/AuditLogger.js'
import { AuthenticationController } from '../controllers/AuthenticationController.js'
import { AuthenticationRouter } from '../routes/AuthenticationRouter.js'

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
      name: 'sessionId',
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
      }),
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
    const tokenService = new TokenService()
    const dogApiClient = new DogApiClient(process.env.DOG_API_URL, tokenService)
    const dogService = new DogService(dogApiClient)
    const dogController = new DogController(dogService)
    const dogRouter = new DogRouter(dogController)

    const auditLogger = new AuditLogger()
    const oauthService = new OAuthService()
    const authController = new AuthenticationController(oauthService, tokenService, auditLogger)
    const authRouter = new AuthenticationRouter(authController)

    const router = createRouter(authRouter.getRouter(), dogRouter.getRouter())
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
