/**
 * @file Service for dog data operations.
 * @module src/services/DogService.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Service layer for dog data operations.
 * Acts as a deliberate seam between the controller and the API client,
 * providing an extension point for future concerns such as caching,
 * request deduplication, or domain logic aggregation.
 * Currently delegates directly to DogApiClient.
 */
export class DogService {
  #dogApiClient

  /**
   * @param {import('./DogApiClient.js').DogApiClient} dogApiClient - Injected dog API client.
   */
  constructor (dogApiClient) {
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
