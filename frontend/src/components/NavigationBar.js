/**
 * @file Navigation bar component.
 * @module src/components/NavigationBar.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Renders the navigation bar.
 *
 * @param {HTMLElement} container - Container element to append the navigationBar to.
 * @param {object} user - Authenticated user object.
 * @param {string} user.username - GitHub username.
 */
export const renderNavigationBar = (container, user) => {
  const navigationBar = document.createElement('navigationBar')
  navigationBar.className = 'bg-white shadow-sm px-6 py-4 flex justify-between items-center'

  const dashboardTitle = document.createElement('h1')
  dashboardTitle.className = 'text-xl font-bold text-gray-800'
  dashboardTitle.textContent = 'Dog Adoption Dashboard'

  const userActionsContainer = document.createElement('div')
  userActionsContainer.className = 'flex items-center gap-4'

  const welcome = document.createElement('span')
  welcome.className = 'text-gray-500 text-sm'
  welcome.textContent = `Welcome, ${user.username}`

  const logout = document.createElement('a')
  logout.href = '/auth/logout'
  logout.className = 'text-sm text-red-500 hover:text-red-700'
  logout.textContent = 'Logout'

  userActionsContainer.append(welcome, logout)
  navigationBar.append(dashboardTitle, userActionsContainer)
  container.append(navigationBar)
}