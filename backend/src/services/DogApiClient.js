/**
 * @file Client for communicating with the Dog Adoption API.
 * @module src/services/DogApiClient.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 *
 * Note: This client receives the Express session directly to enable
 * in-place JWT renewal on 401 responses. This couples the client to
 * Express, accepted as a pragmatic tradeoff given the limited scope
 * of the application.
 */

import { ApiError } from '../utils/errors/ApiError.js'

/**
 * Makes authenticated requests to the Dog Adoption API with automatic JWT renewal on 401.
 */
export class DogApiClient {
  #baseUrl
  #tokenService

  /**
   * @param {string} baseUrl - Dog Adoption API base URL.
   * @param {import('./TokenService.js').TokenService} tokenService - Injected token service.
   */
  constructor (baseUrl, tokenService) {
    this.#baseUrl = baseUrl
    this.#tokenService = tokenService
  }

  /**
   * Makes a request with automatic JWT renewal on 401.
   *
   * @param {string} url - Full URL to fetch.
   * @param {object} options - Fetch options.
   * @param {object} session - Express session object.
   * @returns {Promise<object>} Response JSON.
   */
  async #requestWithRetry (url, options, session) {
    const makeRequest = (jwt) => fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })

    let response = await makeRequest(session.jwt)

    if (response.status === 401) {
      const newJwt = await this.#tokenService.requestToken(
        'github',
        session.user.providerId,
        session.user.email,
        session.user.username
      )
      session.jwt = newJwt
      response = await makeRequest(newJwt)
    }

    if (!response.ok) {
      throw new ApiError(`API request failed: ${response.status}`, response.status)
    }

    return response.json()
  }

  /**
   * Fetches dog statistics from the Dog Adoption API.
   *
   * @param {object} session - Express session object.
   * @returns {Promise<object>} Dog statistics.
   */
  async getStatistics (session) {
    return this.#requestWithRetry(`${this.#baseUrl}/dogs/stats`, {}, session)
  }

  /**
   * Fetches paginated dogs from the Dog Adoption API.
   *
   * @param {object} session - Express session object.
   * @param {object} [params] - Query parameters.
   * @returns {Promise<object>} Paginated dog results.
   */
  async getDogs (session, params = {}) {
    const query = new URLSearchParams(params).toString()
    const url = `${this.#baseUrl}/dogs${query ? `?${query}` : ''}`
    return this.#requestWithRetry(url, {}, session)
  }

  /**
   * Fetches a single dog by ID from the Dog Adoption API.
   *
   * @param {object} session - Express session object.
   * @param {string} id - Dog ID.
   * @returns {Promise<object>} Dog data.
   */
  async getDogById (session, id) {
    return this.#requestWithRetry(`${this.#baseUrl}/dogs/${id}`, {}, session)
  }
}
