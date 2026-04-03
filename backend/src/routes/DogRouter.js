/**
 * @file Dog data proxy router.
 * @module src/routes/DogRouter.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { Router } from 'express'

/**
 * Handles dog data routes proxied from the Dog Adoption API.
 */
export class DogRouter {
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
