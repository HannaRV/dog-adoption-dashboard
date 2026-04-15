/**
 * @file API client for communicating with the Express backend.
 * @module src/api.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { API_URL } from './config.js'

/**
 * Fetches dog statistics from the backend.
 *
 * @returns {Promise<object>} Dog statistics.
 */
export const getStatistics = async () => {
  const response = await fetch(`${API_URL}/statistics`)

  if (!response.ok) {
    const error = new Error('Failed to fetch dog statistics')
    error.status = response.status
    throw error
  }

  return response.json()
}

/**
 * Fetches paginated dogs from the backend.
 *
 * @param {object} [params] - Query parameters (page, limit, filters).
 * @returns {Promise<object>} Paginated dog results.
 */
export const getDogs = async (params = {}, signal = null) => {
  const query = new URLSearchParams(params).toString()
  const url = `${API_URL}/dogs${query ? `?${query}` : ''}`

  const response = await fetch(url, { signal })

  if (!response.ok) {
    const error = new Error('Failed to fetch dogs')
    error.status = response.status
    throw error
  }

  return response.json()
}


/**
 * Fetches a single dog by ID from the backend.
 *
 * @param {string} id - Dog ID.
 * @returns {Promise<object>} Dog data.
 */
export const getDogById = async (id) => {
  const response = await fetch(`${API_URL}/dogs/${id}`)

  if (!response.ok) {
    const error = new Error('Failed to fetch dog')
    error.status = response.status
    throw error
  }

  return response.json()
}