/**
 * @file OAuth 2.0 service for GitHub authentication.
 * @module src/services/OAuthService.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_USER_URL = 'https://api.github.com/user'

/**
 * Handles GitHub OAuth 2.0 authentication flow.
 */
export class OAuthService {
  #clientId
  #clientSecret
  #callbackUrl

  /**
   * @param {string} [clientId] - GitHub OAuth client ID.
   * @param {string} [clientSecret] - GitHub OAuth client secret.
   * @param {string} [callbackUrl] - OAuth callback URL.
   */
  constructor (
    clientId = process.env.GITHUB_CLIENT_ID,
    clientSecret = process.env.GITHUB_CLIENT_SECRET,
    callbackUrl = process.env.GITHUB_CALLBACK_URL
  ) {
    this.#clientId = clientId
    this.#clientSecret = clientSecret
    this.#callbackUrl = callbackUrl
  }

  /**
   * Builds the GitHub authorization URL.
   *
   * @param {string} state - Random state parameter for CSRF protection.
   * @returns {string} GitHub authorization URL.
   */
  getAuthorizationUrl (state) {
    const params = new URLSearchParams({
      client_id: this.#clientId,
      redirect_uri: this.#callbackUrl,
      scope: 'read:user user:email',
      state
    })
    return `${GITHUB_AUTHORIZE_URL}?${params}`
  }

  /**
   * Exchanges authorization code for access token.
   *
   * @param {string} code - Authorization code from GitHub callback.
   * @returns {Promise<string>} GitHub access token.
   */
  async exchangeCodeForToken (code) {
    const response = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: this.#clientId,
        client_secret: this.#clientSecret,
        code,
        redirect_uri: this.#callbackUrl
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new UnauthorizedError(data.error_description || 'Failed to exchange code for token')
    }

    return data.access_token
  }

  /**
   * Fetches the authenticated user's profile from GitHub.
   *
   * @param {string} accessToken - GitHub access token.
   * @returns {Promise<{email: string, name: string, login: string}>} User profile.
   */
  async getUserProfile (accessToken) {
    const response = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json'
      }
    })

    if (!response.ok) {
      throw new UnauthorizedError('Failed to fetch user profile from GitHub')
    }

    const { email, name, login } = await response.json()
    return { email, name, login }
  }
}
