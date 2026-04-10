/**
 * @file Service for dog data operations.
 * @module src/services/DogService.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getStatistics, getDogs } from './dogApiClient.js'

/**
 * Handles dog data retrieval from the Dog Adoption API.
 */
export class DogService {
  /**
   * Retrieves dog statistics.
   *
   * @param {object} session - Express session object.
   * @returns {Promise<object>} Dog statistics.
   */
  async getStatistics (session) {
    return getStatistics(session)
  }

  /**
   * Retrieves paginated dogs with optional filters.
   *
   * @param {object} session - Express session object.
   * @param {object} [params] - Query parameters (page, limit, filters).
   * @returns {Promise<object>} Paginated dog results.
   */
  async getDogs (session, params = {}) {
    return getDogs(session, params)
  }
}
