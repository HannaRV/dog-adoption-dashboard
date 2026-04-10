/**
 * @file Dashboard page.
 * @module src/pages/dashboard.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { navigateTo } from '../router.js'
import { getStatistics } from '../api.js'
import { renderStatisticsCards } from '../components/StatisticsCards.js'
import { renderBarChart } from '../components/BarChart.js'
import { renderDogMap } from '../components/DogMap.js'
import { renderNavigationBar } from '../components/NavigationBar.js'

const AGE_ORDER = ['Baby', 'Young', 'Adult', 'Senior']
const SIZE_ORDER = ['Small', 'Medium', 'Large', 'Extra Large']

/**
 * Sorts chart data by a predefined order.
 *
 * @param {{ x: string[], y: number[] }} data - Chart data.
 * @param {string[]} order - Desired order of x values.
 * @returns {{ x: string[], y: number[] }} Sorted chart data.
 */
const sortByOrder = (data, order) => {
  const sorted = order.map(key => {
    const index = data.x.indexOf(key)
    return { x: key, y: index !== -1 ? data.y[index] : 0 }
  })
  return {
    x: sorted.map(d => d.x),
    y: sorted.map(d => d.y)
  }
}

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
export const render = async (user) => {
  renderLoading()

  const app = document.createElement('div')
  app.className = 'min-h-screen bg-gray-50'

  renderNavigationBar(app, user)

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

  const ageChartWrapper = document.createElement('div')

  const ageChartContainer = document.createElement('div')
  ageChartContainer.className = 'bg-white rounded-xl shadow p-4'

  const chartsFootnote = document.createElement('p')
  chartsFootnote.className = 'text-xs text-gray-400 text-center mt-1'
  chartsFootnote.textContent = 'Age categories as defined by Petfinder.'

  ageChartWrapper.append(ageChartContainer, chartsFootnote)

  const sizeChartContainer = document.createElement('div')
  sizeChartContainer.className = 'bg-white rounded-xl shadow p-4'

  const sexChartContainer = document.createElement('div')
  sexChartContainer.className = 'bg-white rounded-xl shadow p-4'

  chartsSection.append(ageChartWrapper, sizeChartContainer, sexChartContainer)

  // Map
  const mapSection = document.createElement('section')
  mapSection.id = 'map'
  mapSection.className = 'bg-white rounded-xl shadow p-4'
  mapSection.style.height = '600px'

  // Dog list
  const dogListSection = document.createElement('section')
  dogListSection.id = 'dog-list'
  dogListSection.className = 'bg-white rounded-xl shadow p-4'

  const dogListPlaceholder = document.createElement('div')
  dogListPlaceholder.className = 'text-gray-400 text-center py-8'
  dogListPlaceholder.textContent = 'Dog List with Pagination'
  dogListSection.append(dogListPlaceholder)

  main.append(statisticsSection, chartsSection, mapSection, dogListSection)
  app.append(main)
  document.body.replaceChildren(app)

  // Fetch data and render statistics
  try {
    const statistics = await getStatistics()
    renderStatisticsCards(statisticsSection, statistics.booleans)
    renderBarChart(ageChartContainer, sortByOrder(statistics.byAge, AGE_ORDER), 'Age Distribution')
    renderBarChart(sizeChartContainer, sortByOrder(statistics.bySize, SIZE_ORDER), 'Size Distribution')
    renderBarChart(sexChartContainer, statistics.bySex, 'Sex Distribution')
    renderDogMap(mapSection, statistics.byState)

  } catch (error) {
    if (error.status === 401) {
      navigateTo('/')
      return
    }
    console.error('Failed to load statistics:', error)
  }
}
