/**
 * @file Client-side router.
 * @module src/router.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

const routes = {
  '/': () => import('./pages/login.js'),
  '/dashboard': () => import('./pages/dashboard.js')
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
export const render = (path = window.location.pathname) => {
  const route = routes[path] || routes['/']
  route().then(module => module.render())
}
