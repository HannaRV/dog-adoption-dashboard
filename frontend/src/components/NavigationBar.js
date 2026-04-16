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
  navigationBar.className = 'nav-bar'

  const brand = document.createElement('div')
  brand.className = 'nav-brand'

  const logo = document.createElement('div')
  logo.className = 'nav-logo'

  const title = document.createElement('div')

  const titleName = document.createElement('p')
  titleName.className = 'nav-title'
  titleName.textContent = 'Dog Adoption Dashboard'

  const titleSub = document.createElement('p')
  titleSub.className = 'nav-subtitle'
  titleSub.textContent = '~58,000 adoptable dogs across the US'

  title.append(titleName, titleSub)
  brand.append(logo, title)

  const right = document.createElement('div')
  right.className = 'nav-right'

  const avatar = document.createElement('div')
  avatar.className = 'nav-avatar'
  avatar.textContent = user.username.slice(0, 2).toUpperCase()

  const username = document.createElement('span')
  username.className = 'nav-username'
  username.textContent = user.username

  const logout = document.createElement('a')
  logout.href = '/auth/logout'
  logout.className = 'nav-logout'
  logout.textContent = 'Logout'

  right.append(avatar, username, logout)
  navigationBar.append(brand, right)
  container.prepend(navigationBar)
}
