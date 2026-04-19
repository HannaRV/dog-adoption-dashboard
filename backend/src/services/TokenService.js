/**
 * @file Token service for Dog Adoption API authentication.
 * @module src/services/TokenService.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js'

/**
 * Handles JWT token retrieval from the Dog Adoption API.
 */
export class TokenService {
  #apiUrl

  /**
   * @param {string} apiUrl - Dog Adoption API base URL.
   */
  constructor (apiUrl) {
    this.#apiUrl = apiUrl
  }

  /**
   * Requests a JWT via OAuth find-or-create from the Dog Adoption API.
   *
   * @param {string} provider - OAuth provider name (e.g. 'github').
   * @param {string} providerId - Provider's unique user ID.
   * @param {string} email - User email from provider.
   * @param {string} username - Username from provider.
   * @returns {Promise<string>} JWT token.
   */
  async requestToken (provider, providerId, email, username) {
    const response = await fetch(`${this.#apiUrl}/auth/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, providerId, email, username })
    })

    if (!response.ok) {
      throw new UnauthorizedError('Failed to authenticate with Dog Adoption API')
    }

    const data = await response.json()
    return data.token
  }
}
