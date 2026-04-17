/**
 * @file Navigation bar component.
 * @module src/components/NavigationBar.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/** @type {Array<{label: string, sectionId: string}>} */
const NAVIGATION_LINKS = [
  { label: 'Overview', sectionId: 'summary' },
  { label: 'Map', sectionId: 'map' },
  { label: 'Find a Dog', sectionId: 'dog-list' }
]

/**
 * Sets up IntersectionObserver to highlight active nav link on scroll.
 *
 * @param {HTMLElement[]} linkElements - Nav link elements.
 */
export const setupActiveState = (linkElements) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        linkElements.forEach(link => link.classList.remove('nav-link-active'))
        const activeLink = linkElements.find(link => link.dataset.section === entry.target.id)
        if (activeLink) activeLink.classList.add('nav-link-active')
      }
    })
  }, {
    rootMargin: '-72px 0px -50% 0px',
    threshold: 0
  })

  NAVIGATION_LINKS.forEach(({ sectionId }) => {
    const section = document.getElementById(sectionId)
    if (section) observer.observe(section)
  })
}

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

  const navLinks = document.createElement('div')
  navLinks.className = 'nav-links'

  const linkElements = []

  NAVIGATION_LINKS.forEach(({ label, sectionId }) => {
    const link = document.createElement('a')
    link.className = 'nav-link'
    link.dataset.section = sectionId
    link.textContent = label

    link.addEventListener('click', (event) => {
      event.preventDefault()
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    })

    navLinks.append(link)
    linkElements.push(link)
  })

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
  navigationBar.append(brand, navLinks, right)
  container.prepend(navigationBar)

  return linkElements
}
