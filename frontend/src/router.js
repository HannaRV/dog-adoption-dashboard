/**
 * @file Client-side router.
 * @module src/router.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getAuthStatus } from './api.js'
import { resetListeners } from './state.js'

/**
 * Application route definitions.
 * @type {Object.<string, {page: Function, protected: boolean}>}
 */
const ROUTES = {
  '/': { page: () => import('./pages/login.js'), protected: false },
  '/dashboard': { page: () => import('./pages/dashboard.js'), protected: true }
}

/**
 * Navigates to a new path and renders the corresponding page.
 *
 * @param {string} path - The path to navigate to.
 */
export const navigateTo = (path) => {
  window.history.pushState({}, '', path)
  render(path)
}

/**
 * Loads and renders a page module with an optional user object.
 *
 * @param {object} route - Route definition object.
 * @param {object} [user] - Authenticated user object.
 * @returns {Promise<void>}
 */
const loadAndRender = async (route, user) => {
  const module = await route.page()
  module.render(user)
}

/**
 * Renders the page corresponding to the current path.
 *
 * @param {string} [path] - The path to render. Defaults to current pathname.
 * @returns {Promise<void>}
 */
export const render = async (path = window.location.pathname) => {
  resetListeners('stateChanged')

  const route = ROUTES[path] || ROUTES['/']

  if (route.protected) {
    try {
      const { authenticated, user } = await getAuthStatus()
      if (!authenticated) {
        navigateTo('/')
        return
      }
      await loadAndRender(route, user)
    } catch {
      navigateTo('/')
    }
    return
  }

  await loadAndRender(route)
}
