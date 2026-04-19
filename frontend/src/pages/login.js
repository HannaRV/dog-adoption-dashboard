/**
 * @file Login page.
 * @module src/pages/login.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Creates the login card content element.
 *
 * @returns {HTMLElement} Login card element.
 */
const createLoginCard = () => {
  const card = document.createElement('div')
  card.className = 'login-card'

  const dogImage = document.createElement('img')
  dogImage.src = '/assets/dog.jpg'
  dogImage.alt = 'A happy dalmatian dog'
  dogImage.className = 'login-dog'

  const loginContent = document.createElement('div')
  loginContent.className = 'login-text-side'

  const sourceLabel = document.createElement('p')
  sourceLabel.className = 'login-label'
  sourceLabel.textContent = 'Petfinder · Kaggle'

  const heading = document.createElement('h1')
  heading.className = 'login-heading'
  heading.textContent = 'Find your perfect dog companion'

  const description = document.createElement('p')
  description.className = 'login-description'
  description.textContent = 'Explore ~58,000 adoptable dogs across the United States'

  const githubLoginButton = document.createElement('a')
  githubLoginButton.href = '/auth/github/login'
  githubLoginButton.className = 'login-button'

  const githubIcon = document.createElement('img')
  githubIcon.src = '/assets/github-icon.svg'
  githubIcon.alt = 'GitHub'
  githubIcon.className = 'login-button-icon'

  githubLoginButton.append(githubIcon, document.createTextNode(' Sign in with GitHub'))

  loginContent.append(sourceLabel, heading, description, githubLoginButton)
  card.append(dogImage, loginContent)
  return card
}

/**
 * Renders the login page.
 */
export const render = () => {
  const container = document.createElement('div')
  container.className = 'login-container'
  container.append(createLoginCard())
  document.body.replaceChildren(container)
}
