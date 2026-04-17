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
 * Returns the current height of the navigation bar in pixels.
 *
 * @returns {number} Navigation bar height in pixels.
 */
const getNavigationBarHeight = () => {
  const navigationBar = document.querySelector('.nav-bar')
  return navigationBar ? navigationBar.offsetHeight : 72
}

/**
 * Scrolls smoothly to a section by ID.
 *
 * @param {string} sectionId - ID of the section to scroll to.
 */
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) section.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Sets up IntersectionObserver to highlight active navigation link on scroll.
 *
 * @param {HTMLElement[]} linkElements - Navigation link elements.
 */
export const setupActiveState = (linkElements) => {
  const navigationBarHeight = getNavigationBarHeight()

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        linkElements.forEach(link => link.classList.remove('nav-link-active'))
        const activeLink = linkElements.find(link => link.dataset.section === entry.target.id)
        if (activeLink) activeLink.classList.add('nav-link-active')
      }
    })
  }, {
    rootMargin: `-${navigationBarHeight}px 0px -50% 0px`,
    threshold: 0
  })

  NAVIGATION_LINKS.forEach(({ sectionId }) => {
    const section = document.getElementById(sectionId)
    if (section) observer.observe(section)
  })
}

/**
 * Creates a navigation link element.
 *
 * @param {string} label - Link label.
 * @param {string} sectionId - ID of the section to scroll to.
 * @returns {HTMLElement} Navigation link element.
 */
const createNavigationLink = (label, sectionId) => {
  const link = document.createElement('a')
  link.className = 'nav-link'
  link.dataset.section = sectionId
  link.textContent = label
  link.addEventListener('click', (event) => {
    event.preventDefault()
    scrollToSection(sectionId)
  })
  return link
}

/**
 * Renders the navigation bar.
 *
 * @param {HTMLElement} container - Container element to append the navigation bar to.
 * @param {object} user - Authenticated user object.
 * @param {string} user.username - GitHub username.
 * @returns {HTMLElement[]} Navigation link elements.
 */
export const renderNavigationBar = (container, user) => {
  const navigationBar = document.createElement('nav')
  navigationBar.className = 'nav-bar'

  const brand = document.createElement('div')
  brand.className = 'nav-brand'
  const logo = document.createElement('div')
  logo.className = 'nav-logo'

  const titleName = document.createElement('p')
  titleName.className = 'nav-title'
  titleName.textContent = 'Dog Adoption Dashboard'

  const titleSubtitle = document.createElement('p')
  titleSubtitle.className = 'nav-subtitle'
  titleSubtitle.textContent = '~58,000 adoptable dogs across the US'

  const titleGroup = document.createElement('div')
  titleGroup.append(titleName, titleSubtitle)
  brand.append(logo, titleGroup)

  const navigationLinksContainer = document.createElement('div')
  navigationLinksContainer.className = 'nav-links'

  const linkElements = NAVIGATION_LINKS.map(({ label, sectionId }) => {
    const link = createNavigationLink(label, sectionId)
    navigationLinksContainer.append(link)
    return link
  })

  const rightSection = document.createElement('div')
  rightSection.className = 'nav-right'

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

  rightSection.append(avatar, username, logout)
  navigationBar.append(brand, navigationLinksContainer, rightSection)
  container.prepend(navigationBar)

  return linkElements
}
