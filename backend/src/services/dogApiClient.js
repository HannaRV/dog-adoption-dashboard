/**
 * @file Client for communicating with the Dog Adoption API.
 * @module src/services/dogApiClient.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

const DOG_API_BASE_URL = process.env.DOG_API_URL

/**
 * Fetches dog statistics from the Dog Adoption API.
 *
 * @param {string} jwt - JWT token from session.
 * @returns {Promise<object>} Dog statistics.
 */
export const getStats = async (jwt) => {
  const response = await fetch(`${DOG_API_BASE_URL}/dogs/stats`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = new Error('Failed to fetch dog stats')
    error.status = response.status
    throw error
  }

  return response.json()
}

/**
 * Fetches paginated dogs from the Dog Adoption API.
 *
 * @param {string} jwt - JWT token from session.
 * @param {object} [params] - Query parameters (page, limit, filters).
 * @returns {Promise<object>} Paginated dog results.
 */
export const getDogs = async (jwt, params = {}) => {
  const query = new URLSearchParams(params).toString()
  const url = `${DOG_API_BASE_URL}/dogs${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = new Error('Failed to fetch dogs')
    error.status = response.status
    throw error
  }

  return response.json()
}
