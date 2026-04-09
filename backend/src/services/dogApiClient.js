/**
 * @file Client for communicating with the Dog Adoption API.
 * @module src/services/dogApiClient.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { TokenService } from './TokenService.js'

const DOG_API_BASE_URL = process.env.DOG_API_URL
const tokenService = new TokenService()

/**
 * Makes a request to the Dog Adoption API with automatic JWT renewal on 401.
 *
 * @param {string} url - Full URL to fetch.
 * @param {object} options - Fetch options.
 * @param {object} session - Express session object.
 * @returns {Promise<object>} Response JSON.
 */
const requestWithRetry = async (url, options, session) => {
  const makeRequest = (jwt) => fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    }
  })

  let response = await makeRequest(session.jwt)

  if (response.status === 401) {
    const newJwt = await tokenService.getToken(
      'github',
      session.user.providerId,
      session.user.email,
      session.user.username
    )
    session.jwt = newJwt
    response = await makeRequest(newJwt)
  }

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

/**
 * Fetches dog statistics from the Dog Adoption API.
 *
 * @param {object} session - Express session object.
 * @returns {Promise<object>} Dog statistics.
 */
export const getStats = async (session) => {
  return requestWithRetry(`${DOG_API_BASE_URL}/dogs/stats`, {}, session)
}

/**
 * Fetches paginated dogs from the Dog Adoption API.
 *
 * @param {object} session - Express session object.
 * @param {object} [params] - Query parameters (page, limit, filters).
 * @returns {Promise<object>} Paginated dog results.
 */
export const getDogs = async (session, params = {}) => {
  const query = new URLSearchParams(params).toString()
  const url = `${DOG_API_BASE_URL}/dogs${query ? `?${query}` : ''}`
  return requestWithRetry(url, {}, session)
}
