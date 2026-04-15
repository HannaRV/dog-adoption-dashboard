/**
 * @file Service for dog data operations.
 * @module src/services/DogService.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { DogApiClient } from './DogApiClient.js'

/**
 * Service layer for dog data operations.
 * Abstracts the data source from the controller,
 * allowing the underlying client to change without affecting callers.
 */
export class DogService {
  #dogApiClient

  /**
   * @param {DogApiClient} [dogApiClient] - Injected for testing.
   */
  constructor (dogApiClient = new DogApiClient()) {
    this.#dogApiClient = dogApiClient
  }

  /**
   * Retrieves dog statistics.
   *
   * @param {object} session - Express session object.
   * @returns {Promise<object>} Dog statistics.
   */
  async getStatistics (session) {
    return this.#dogApiClient.getStatistics(session)
  }

  /**
   * Retrieves paginated dogs with optional filters.
   *
   * @param {object} session - Express session object.
   * @param {object} [params] - Query parameters.
   * @returns {Promise<object>} Paginated dog results.
   */
  async getDogs (session, params = {}) {
    return this.#dogApiClient.getDogs(session, params)
  }

  /**
   * Retrieves a single dog by ID.
   *
   * @param {object} session - Express session object.
   * @param {string} id - Dog ID.
   * @returns {Promise<object>} Dog data.
   */
  async getDogById (session, id) {
    return this.#dogApiClient.getDogById(session, id)
  }
}
