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

  const card = document.createElement('div')
  card.className = 'login-card'

  const img = document.createElement('img')
  img.src = '/assets/dog.jpg'
  img.alt = 'A happy dalmatian dog'
  img.className = 'login-dog'

  const textSide = document.createElement('div')
  textSide.className = 'login-text-side'

  const label = document.createElement('p')
  label.className = 'login-label'
  label.textContent = 'Petfinder · Kaggle'

  const heading = document.createElement('h1')
  heading.className = 'login-heading'
  heading.textContent = 'Find your perfect dog companion'

  const description = document.createElement('p')
  description.className = 'login-description'
  description.textContent = 'Explore ~58,000 adoptable dogs across the United States'

  const link = document.createElement('a')
  link.href = '/auth/github/login'
  link.className = 'login-button'

  const githubIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  githubIcon.setAttribute('width', '16')
  githubIcon.setAttribute('height', '16')
  githubIcon.setAttribute('viewBox', '0 0 16 16')
  githubIcon.setAttribute('fill', 'white')
  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  iconPath.setAttribute('d', 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z')
  githubIcon.append(iconPath)

  const linkText = document.createTextNode(' Sign in with GitHub')

  link.append(githubIcon, linkText)
  textSide.append(label, heading, description, link)
  card.append(img, textSide)
  container.append(card)
  document.body.replaceChildren(container)
}
