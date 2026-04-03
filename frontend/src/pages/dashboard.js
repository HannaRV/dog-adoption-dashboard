/**
 * @file Dashboard page.
 * @module src/pages/dashboard.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { navigateTo } from '../router.js'

/**
 * Renders the dashboard page.
 */
export const render = async () => {
  const response = await fetch('/auth/status')
  const { authenticated, user } = await response.json()

  if (!authenticated) {
    navigateTo('/')
    return
  }

  const container = document.createElement('div')
  container.className = 'dashboard-container'

  const heading = document.createElement('h1')
  heading.textContent = 'Dog Adoption Dashboard'

  const welcome = document.createElement('p')
  welcome.textContent = `Welcome, ${user.username}!`

  const logout = document.createElement('a')
  logout.href = '/auth/logout'
  logout.textContent = 'Logout'

  container.append(heading, welcome, logout)
  document.body.replaceChildren(container)
}
