/**
 * @file Login page.
 * @module src/pages/login.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Renders the login page.
 */
export const render = () => {
  const container = document.createElement('div')
  container.className = 'login-container'

  const heading = document.createElement('h1')
  heading.textContent = 'Dog Adoption Dashboard'

  const link = document.createElement('a')
  link.href = '/auth/github/login'
  link.className = 'login-button'
  link.textContent = 'Sign in with GitHub'

  container.append(heading, link)
  document.body.replaceChildren(container)
}