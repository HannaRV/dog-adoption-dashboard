/**
 * @file Controller for dog data requests.
 * @module src/controllers/DogController.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { DogService } from '../services/DogService.js'

/**
 * Handles dog data HTTP requests.
 */
export class DogController {
  #dogService

  /**
   * @param {DogService} [dogService] - Injected for testing.
   */
  constructor(dogService = new DogService()) {
    this.#dogService = dogService
  }

  /**
   * Returns dog statistics.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getStatistics(req, res, next) {
    try {
      const statistics = await this.#dogService.getStatistics(req.session)
      res.json(statistics)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns paginated dogs with optional filters.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getDogs(req, res, next) {
    try {
      const dogs = await this.#dogService.getDogs(req.session, req.query)
      res.json(dogs)
    } catch (error) {
      next(error)
    }
  }

  /**
 * Returns a single dog by ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getDogById(req, res, next) {
    try {
      const dog = await this.#dogService.getDogById(req.session, req.params.id)
      res.json(dog)
    } catch (error) {
      next(error)
    }
  }
}
