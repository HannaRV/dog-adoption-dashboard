/**
 * @file API client for communicating with the Express backend.
 * @module src/api.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { API_URL, AUTH_URL } from './config.js'
import { ApiError } from './utils/errors/ApiError.js'

/**
 * Handles a fetch response — throws an error with status if not ok.
 *
 * @param {Response} response - Fetch response object.
 * @returns {Promise<object>} Parsed JSON response.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new ApiError('Failed to fetch data', response.status)
  }
  return response.json()
}

/**
 * Fetches dog statistics from the backend.
 *
 * @returns {Promise<object>} Dog statistics.
 */
export const getStatistics = async () => {
  const response = await fetch(`${API_URL}/statistics`)
  return handleResponse(response)
}

/**
 * Fetches paginated dogs from the backend.
 *
 * @param {object} [params] - Query parameters (page, limit, filters).
 * @param {AbortSignal|null} [signal] - Optional abort signal.
 * @returns {Promise<object>} Paginated dog results.
 */
export const getDogs = async (params = {}, signal = null) => {
  const query = new URLSearchParams(params).toString()
  const url = `${API_URL}/dogs${query ? `?${query}` : ''}`
  const response = await fetch(url, { signal })
  return handleResponse(response)
}

/**
 * Fetches a single dog by ID from the backend.
 *
 * @param {string} dogId - Dog ID.
 * @returns {Promise<object>} Dog data.
 */
export const getDogById = async (dogId) => {
  const response = await fetch(`${API_URL}/dogs/${dogId}`)
  return handleResponse(response)
}

/**
 * Fetches dogs filtered by US state from the backend.
 *
 * @param {string} stateCode - US state code.
 * @param {number} [limit] - Maximum number of dogs to fetch.
 * @returns {Promise<object>} Dog results.
 */
export const getDogsByState = async (stateCode, limit = 100) => {
  const response = await fetch(`${API_URL}/dogs?contactState=${stateCode}&limit=${limit}`)
  return handleResponse(response)
}

/**
 * Fetches the current authentication status from the backend.
 *
 * @returns {Promise<{authenticated: boolean, user?: object}>} Authentication status.
 */
export const getAuthStatus = async () => {
  const response = await fetch(`${AUTH_URL}/status`)
  return handleResponse(response)
}

