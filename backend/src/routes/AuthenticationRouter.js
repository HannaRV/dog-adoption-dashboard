/**
 * @file Authentication router.
 * @module src/routes/AuthenticationRouter.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { Router } from 'express'
import { AuthenticationController } from '../controllers/AuthenticationController.js'

/**
 * Handles authentication routes for OAuth flow.
 */
export class AuthenticationRouter {
  #router
  #controller

  /**
   * @param {AuthenticationController} [controller] - Injected for testing.
   */
  constructor (controller = new AuthenticationController()) {
    this.#router = Router()
    this.#controller = controller
    this.#initializeRoutes()
  }

  #initializeRoutes () {
    this.#router.get('/github/login', (req, res) => this.#controller.login(req, res))
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
