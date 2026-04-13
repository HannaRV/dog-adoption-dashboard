/**
 * @file Client-side router.
 * @module src/router.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { AUTH_URL } from './config.js'
import { resetListeners } from './state.js'

/**
 * Application route definitions.
 * @type {object}
 */
const routes = {
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
 * Renders the page corresponding to the current path.
 *
 * @param {string} [path] - The path to render. Defaults to current pathname.
 */
export const render = async (path = window.location.pathname) => {
  resetListeners('stateChanged')  // städa upp lyssnare innan ny sida renderas

  const route = routes[path] || routes['/']

  if (route.protected) {
    const response = await fetch(`${AUTH_URL}/status`)
    const { authenticated, user } = await response.json()
    if (!authenticated) {
      navigateTo('/')
      return
    }
    const module = await route.page()
    module.render(user)
    return
  }

  const module = await route.page()
  module.render()
}
