/**
 * @file Service for dog data operations.
 * @module src/services/DogService.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getStats, getDogs } from './dogApiClient.js'

/**
 * Handles dog data retrieval from the Dog Adoption API.
 */
export class DogService {
  /**
   * Retrieves dog statistics.
   *
   * @param {string} jwt - JWT token from session.
   * @returns {Promise<object>} Dog statistics.
   */
  async getStats (jwt) {
    return getStats(jwt)
  }

  /**
   * Retrieves paginated dogs with optional filters.
   *
   * @param {string} jwt - JWT token from session.
   * @param {object} [params] - Query parameters (page, limit, filters).
   * @returns {Promise<object>} Paginated dog results.
   */
  async getDogs (jwt, params = {}) {
    return getDogs(jwt, params)
  }
}
