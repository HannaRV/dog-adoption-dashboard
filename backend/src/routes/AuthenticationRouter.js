/**
 * @file Authentication router.
 * @module src/routes/AuthenticationRouter.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { Router } from 'express'

/**
 * Handles authentication routes.
 */
export class AuthenticationRouter {
  #router

  constructor () {
    this.#router = Router()
    this.#initializeRoutes()
  }

  #initializeRoutes () {
    // Routes will be added here
  }

  /**
   * Returns the Express router instance.
   *
   * @returns {Router} Express router.
   */
  getRouter () {
    return this.#router
  }
}
