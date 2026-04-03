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
   * @param {string} [apiUrl] - Dog Adoption API base URL.
   */
  constructor (apiUrl = process.env.DOG_API_URL) {
    this.#apiUrl = apiUrl
  }

  /**
   * Retrieves a JWT by registering or logging in via the Dog Adoption API.
   *
   * @param {string} email - User email from GitHub profile.
   * @param {string} username - User login from GitHub profile.
   * @returns {Promise<string>} JWT token.
   */
  async getToken (email, username) {
    const token = await this.#tryLogin(email, username)
    return token
  }

  async #tryLogin (email, username) {
    const response = await fetch(`${this.#apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: this.#derivePassword(username) })
    })

    if (response.status === 401) {
      return this.#tryRegister(email, username)
    }

    if (!response.ok) {
      throw new UnauthorizedError('Failed to authenticate with Dog Adoption API')
    }

    const data = await response.json()
    return data.token
  }

  async #tryRegister (email, username) {
    const response = await fetch(`${this.#apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password: this.#derivePassword(username)
      })
    })

    if (!response.ok) {
      throw new UnauthorizedError('Failed to register with Dog Adoption API')
    }

    const data = await response.json()
    return data.token
  }

  /**
   * Derives a deterministic password from the GitHub username.
   *
   * @param {string} username - GitHub username.
   * @returns {string} Derived password.
   */
  #derivePassword (username) {
    return `oauth_${username}_${process.env.TOKEN_SECRET}`
  }
}
