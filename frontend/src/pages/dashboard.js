/**
 * @file Dashboard page.
 * @module src/pages/dashboard.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { navigateTo } from '../router.js'
import { getStatistics } from '../api.js'
import { renderStatisticsCards } from '../components/StatisticsCards.js'

/**
 * Renders the loading state.
 */
const renderLoading = () => {
  const loading = document.createElement('div')
  loading.className = 'min-h-screen flex items-center justify-center bg-gray-50'

  const spinner = document.createElement('p')
  spinner.className = 'text-gray-500 text-lg'
  spinner.textContent = 'Loading...'

  loading.append(spinner)
  document.body.replaceChildren(loading)
}

/**
 * Renders the dashboard page.
 */
export const render = async () => {
  renderLoading()

  const response = await fetch('/auth/status')
  const { authenticated, user } = await response.json()

  if (!authenticated) {
    navigateTo('/')
    return
  }

  const app = document.createElement('div')
  app.className = 'min-h-screen bg-gray-50'

  // NavigationBar
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

  // Main content
  const main = document.createElement('main')
  main.className = 'max-w-7xl mx-auto px-6 py-8 space-y-8'

  // Statistics cards
  const statisticsSection = document.createElement('section')
  statisticsSection.id = 'statistics-cards'

  // Charts
  const chartsSection = document.createElement('section')
  chartsSection.id = 'charts'
  chartsSection.className = 'grid grid-cols-1 md:grid-cols-3 gap-4'

  const charts = ['Age Chart', 'Size Chart', 'Sex Chart']
  charts.forEach(chart => {
    const div = document.createElement('div')
    div.className = 'bg-white rounded-xl shadow p-4 h-64 flex items-center justify-center text-gray-400'
    div.textContent = chart
    chartsSection.append(div)
  })

  // Map
  const mapSection = document.createElement('section')
  mapSection.id = 'map'
  mapSection.className = 'bg-white rounded-xl shadow p-4 h-96 flex items-center justify-center text-gray-400'
  mapSection.textContent = 'US Map — Dogs per State'

  // Dog list
  const dogListSection = document.createElement('section')
  dogListSection.id = 'dog-list'
  dogListSection.className = 'bg-white rounded-xl shadow p-4'

  const dogListPlaceholder = document.createElement('div')
  dogListPlaceholder.className = 'text-gray-400 text-center py-8'
  dogListPlaceholder.textContent = 'Dog List with Pagination'
  dogListSection.append(dogListPlaceholder)

  main.append(statisticsSection, chartsSection, mapSection, dogListSection)
  app.append(nav, main)
  document.body.replaceChildren(app)

  // Fetch data and render statistics
  try {
    const statistics = await getStatistics()
    renderStatisticsCards(statisticsSection, statistics.booleans)
  } catch (error) {
    console.error('Failed to load statistics:', error)
  }
}
