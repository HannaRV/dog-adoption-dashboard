/**
 * @file Navigation bar component.
 * @module src/components/NavigationBar.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Renders the navigation bar.
 *
 * @param {HTMLElement} container - Container element to append the nav to.
 * @param {object} user - Authenticated user object.
 * @param {string} user.username - GitHub username.
 */
export const renderNavigationBar = (container, user) => {
  const nav = document.createElement('nav')
  nav.className = 'bg-white shadow-sm px-6 py-4 flex justify-between items-center'

  const title = document.createElement('h1')
  title.className = 'text-xl font-bold text-gray-800'
  title.textContent = 'Dog Adoption Dashboard'

  const navRight = document.createElement('div')
  navRight.className = 'flex items-center gap-4'

  const welcome = document.createElement('span')
  welcome.className = 'text-gray-500 text-sm'
  welcome.textContent = `Welcome, ${user.username}`

  const logout = document.createElement('a')
  logout.href = '/auth/logout'
  logout.className = 'text-sm text-red-500 hover:text-red-700'
  logout.textContent = 'Logout'

  navRight.append(welcome, logout)
  nav.append(title, navRight)
  container.append(nav)
}