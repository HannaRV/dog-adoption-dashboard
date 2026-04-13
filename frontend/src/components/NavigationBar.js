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
  const navigationBar = document.createElement('nav')
  navigationBar.className = 'bg-white shadow-sm px-6 py-4 flex justify-between items-center'

  const welcome = document.createElement('h1')
  welcome.className = 'text-xl font-bold text-gray-800 text-center flex-1'
  welcome.textContent = `Welcome to Dog Adoption Dashboard, ${user.username}!`

  const logout = document.createElement('a')
  logout.href = '/auth/logout'
  logout.className = 'text-l text-red-700 hover:text-red-900'
  logout.textContent = 'Logout'

  navigationBar.append(welcome, logout)
  container.append(navigationBar)
}
