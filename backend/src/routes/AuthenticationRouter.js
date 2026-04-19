/**
 * @file Authentication router.
 * @module src/routes/AuthenticationRouter.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { Router } from 'express'

/**
 * Handles authentication routes for OAuth flow.
 */
export class AuthenticationRouter {
  #router
  #controller

  /**
  * @param {import('../controllers/AuthenticationController.js').AuthenticationController} controller - Injected authentication controller.
  */
  constructor (controller) {
    this.#router = Router()
    this.#controller = controller
    this.#initializeRoutes()
  }

  #initializeRoutes() {
    this.#router.get('/github/login', (req, res, next) => this.#controller.login(req, res, next))
    this.#router.get('/github/callback', (req, res, next) => this.#controller.callback(req, res, next))
    this.#router.get('/logout', (req, res, next) => this.#controller.logout(req, res, next))
    this.#router.get('/status', (req, res) => this.#controller.status(req, res))
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
