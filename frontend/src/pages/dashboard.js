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
import { renderDogList } from '../components/DogList.js'
import { renderSummaryBar } from '../components/SummaryBar.js'
import { renderFilterPanel } from '../components/FilterPanel.js'
import { subscribe } from '../state.js'

/** @type {string[]} */
const AGE_ORDER = ['Baby', 'Young', 'Adult', 'Senior']

/** @type {string[]} */
const SIZE_ORDER = ['Small', 'Medium', 'Large', 'Extra Large']

/**
 * Sorts chart data by a predefined order.
 *
 * @param {{ x: string[], y: number[] }} chartData - Chart data.
 * @param {string[]} order - Desired order of x values.
 * @returns {{ x: string[], y: number[] }} Sorted chart data.
 */
const sortByOrder = (chartData, order) => {
  const sorted = order.map(key => {
    const index = chartData.x.indexOf(key)
    return { x: key, y: index !== -1 ? chartData.y[index] : 0 }
  })
  return {
    x: sorted.map(sortedItem => sortedItem.x),
    y: sorted.map(sortedItem => sortedItem.y)
  }
}

/**
 * Filters out entries with a specific label from chart data.
 *
 * @param {{ x: string[], y: number[] }} chartData - Chart data.
 * @param {string} labelToExclude - Label to filter out.
 * @returns {{ x: string[], y: number[] }} Filtered chart data.
 */
const filterChartData = (chartData, labelToExclude) => ({
  x: chartData.x.filter(label => label !== labelToExclude),
  y: chartData.y.filter((_, index) => chartData.x[index] !== labelToExclude)
})

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
 * Creates an error message element.
 *
 * @param {string} message - Error message to display.
 * @returns {HTMLElement} Error message element.
 */
const createErrorMessage = (message) => {
  const errorMsg = document.createElement('p')
  errorMsg.className = 'text-red-500 text-center py-8'
  errorMsg.textContent = message
  return errorMsg
}

/**
 * Handles fetch errors — redirects to login on 401, shows error message otherwise.
 *
 * @param {Error} error - The caught error.
 * @param {HTMLElement} container - Container to show error in.
 */
const handleFetchError = (error, container) => {
  if (error.status === 401) {
    navigateTo('/')
    return
  }
  container.replaceChildren(createErrorMessage('Failed to load data. Please try again.'))
}

/**
 * Renders the dashboard page.
 *
 * @param {object} user - Authenticated user object.
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

  const summarySection = document.createElement('section')
  summarySection.id = 'summary'

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

  const filterContainer = document.createElement('div')
  const dogListContainer = document.createElement('div')

  dogListSection.append(filterContainer, dogListContainer)

  main.append(summarySection, chartsSection, statisticsSection, mapSection, dogListSection)
  app.append(main)
  document.body.replaceChildren(app)

  // Fetch and render statistics, charts and map
  try {
    const statistics = await getStatistics()
    renderSummaryBar(summarySection, statistics)
    renderStatisticsCards(statisticsSection, statistics.booleans)
    renderBarChart(ageChartContainer, sortByOrder(statistics.byAge, AGE_ORDER), 'Age Distribution')
    renderBarChart(sizeChartContainer, sortByOrder(statistics.bySize, SIZE_ORDER), 'Size Distribution')
    renderBarChart(sexChartContainer, filterChartData(statistics.bySex, 'Unknown'), 'Sex Distribution')

    await renderDogMap(mapSection, statistics.byState)
  } catch (error) {
    handleFetchError(error, main)
  }

  // Fetch and render dog list
  try {
    renderFilterPanel(filterContainer)

    const onFiltersChanged = (newState) => {
      renderDogList(dogListContainer, newState.filters)
    }

    subscribe('stateChanged', onFiltersChanged)
    await renderDogList(dogListContainer)
  } catch (error) {
    handleFetchError(error, dogListSection)
  }
}
