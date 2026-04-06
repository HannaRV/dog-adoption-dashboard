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
  container.className = 'min-h-screen bg-gray-50 flex items-center justify-center'

  const card = document.createElement('div')
  card.className = 'bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center'

  const heading = document.createElement('h1')
  heading.className = 'text-3xl font-bold text-gray-800 mb-2'
  heading.textContent = 'Dog Adoption Dashboard'

  const subtitle = document.createElement('p')
  subtitle.className = 'text-gray-500 mb-8'
  subtitle.textContent = 'Explore ~58,000 adoptable dogs across the United States'

  const link = document.createElement('a')
  link.href = '/auth/github/login'
  link.className = 'inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium'
  link.textContent = 'Sign in with GitHub'

  card.append(heading, subtitle, link)
  container.append(card)
  document.body.replaceChildren(container)
}
