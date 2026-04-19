/**
 * @file Dog data proxy router.
 * @module src/routes/DogRouter.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { Router } from 'express'
import { requireAuthentication } from '../middleware/requireAuthentication.js'

/**
 * Handles dog data routes proxied from the Dog Adoption API.
 */
export class DogRouter {
  #router
  #controller

  /**
   * @param {import('../controllers/DogController.js').DogController} controller - Injected dog controller.
   */
  constructor (controller) {
    this.#router = Router()
    this.#controller = controller
    this.#initializeRoutes()
  }

  #initializeRoutes () {
    this.#router.use(requireAuthentication)
    this.#router.get('/statistics', (req, res, next) => this.#controller.getStatistics(req, res, next))
    this.#router.get('/dogs', (req, res, next) => this.#controller.getDogs(req, res, next))
    this.#router.get('/dogs/:id', (req, res, next) => this.#controller.getDogById(req, res, next))
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
