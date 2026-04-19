/**
 * @file Application configuration constants.
 * @module src/config.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

export const API_URL = '/api/v1'
export const AUTH_URL = '/auth'

/**
 * Dashboard section element IDs.
 * Used for DOM element IDs, navigation scroll targets, and CSS selectors.
 * Values are mirrored in css/style.css — keep in sync if changed.
 *
 * @type {object}
 */
export const DASHBOARD_SECTIONS = {
  OVERVIEW: 'summary',
  MAP: 'map',
  DOG_LIST: 'dog-list'
}
