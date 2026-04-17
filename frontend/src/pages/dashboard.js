/**
 * @file Dashboard page.
 * @module src/pages/dashboard.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { navigateTo } from '../router.js'
import { getStatistics } from '../api.js'
import { renderBooleanChart } from '../components/BooleanChart.js'
import { renderBarChart } from '../components/BarChart.js'
import { renderDogMap } from '../components/DogMap.js'
import { renderNavigationBar, setupActiveState } from '../components/NavigationBar.js'
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
 * Renders the loading state for the full page.
 */
const renderLoading = () => {
  const loading = document.createElement('div')
  loading.className = 'loading-screen'

  const spinner = document.createElement('p')
  spinner.className = 'loading-text'
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
  const errorMessage = document.createElement('p')
  errorMessage.className = 'error-message'
  errorMessage.textContent = message
  return errorMessage
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
 * Creates a section heading element.
 *
 * @param {string} text - Heading text.
 * @returns {HTMLElement} Heading element.
 */
const createSectionHeading = (text) => {
  const heading = document.createElement('h2')
  heading.className = 'dashboard-section-heading'
  heading.textContent = text
  return heading
}

/**
 * Creates and returns the dashboard layout containers.
 *
 * @returns {object} Layout containers.
 */
const createDashboardLayout = () => {
  const dashboardRoot = document.createElement('div')
  dashboardRoot.className = 'dashboard-app'

  const main = document.createElement('main')
  main.className = 'dashboard-main'

  // Overview section — wraps heading, summary bar and charts
  const overviewSection = document.createElement('section')
  overviewSection.id = 'summary'

  const summaryContainer = document.createElement('div')

  const chartsContainer = document.createElement('div')
  chartsContainer.className = 'dashboard-charts'

  const ageChartContainer = document.createElement('div')
  ageChartContainer.className = 'chart-container-age'

  const sizeChartContainer = document.createElement('div')
  sizeChartContainer.className = 'chart-container-size'

  const sexChartContainer = document.createElement('div')
  sexChartContainer.className = 'chart-container-sex'

  const booleanChartContainer = document.createElement('div')
  booleanChartContainer.className = 'boolean-chart-container'
  booleanChartContainer.id = 'boolean-chart'

  chartsContainer.append(ageChartContainer, sizeChartContainer, sexChartContainer, booleanChartContainer)

  overviewSection.append(
    createSectionHeading('Overview'),
    summaryContainer,
    chartsContainer
  )

  // Map section
  const mapSection = document.createElement('section')
  mapSection.id = 'map'
  mapSection.className = 'map-section'

  // Find a dog section — wraps heading, filter panel and dog list
  const findDogSection = document.createElement('section')
  findDogSection.id = 'dog-list'

  const dogListContent = document.createElement('div')
  dogListContent.className = 'dog-list-section'

  const filterContainer = document.createElement('div')
  const dogListContainer = document.createElement('div')
  dogListContent.append(filterContainer, dogListContainer)

  findDogSection.append(
    createSectionHeading("Let's find you a new friend:"),
    dogListContent
  )

  main.append(overviewSection, mapSection, findDogSection)

  // Footer
  const footer = document.createElement('footer')
  footer.className = 'dashboard-footer'

  const footerLeft = document.createElement('span')
  footerLeft.className = 'dashboard-footer-left'
  footerLeft.textContent = 'Data sourced from Petfinder via Kaggle'

  const footerRight = document.createElement('span')
  footerRight.className = 'dashboard-footer-right'
  footerRight.textContent = '© 2026 Hanna Rubio Vretby'

  footer.append(footerLeft, footerRight)
  dashboardRoot.append(main, footer)

  return {
    dashboardRoot,
    main,
    summaryContainer,
    booleanChartContainer,
    ageChartContainer,
    sizeChartContainer,
    sexChartContainer,
    mapSection,
    filterContainer,
    dogListContainer,
    findDogSection
  }
}

/**
 * Renders the statistics overview section including summary bar,
 * bar charts, boolean chart and map.
 *
 * @param {object} layout - Layout containers.
 * @param {HTMLElement[]} linkElements - Nav link elements for active state.
 * @returns {Promise<void>}
 */
const renderStatistics = async (layout, linkElements) => {
  const statistics = await getStatistics()

  document.body.replaceChildren(layout.dashboardRoot)
  setupActiveState(linkElements)

  renderSummaryBar(layout.summaryContainer, statistics)
  renderBooleanChart(layout.booleanChartContainer, statistics.booleans)
  renderBarChart(layout.ageChartContainer, sortByOrder(statistics.byAge, AGE_ORDER), 'Age Distribution')
  renderBarChart(layout.sizeChartContainer, sortByOrder(statistics.bySize, SIZE_ORDER), 'Size Distribution')
  renderBarChart(layout.sexChartContainer, filterChartData(statistics.bySex, 'Unknown'), 'Sex Distribution')
  await renderDogMap(layout.mapSection, statistics.byState, statistics.summary.total)
}

/**
 * Renders the dog search section including filter panel and dog list.
 *
 * @param {object} layout - Layout containers.
 * @returns {Promise<void>}
 */
const renderDogSearch = async (layout) => {
  renderFilterPanel(layout.filterContainer)

  const onFiltersChanged = async (newState) => {
    try {
      await renderDogList(layout.dogListContainer, newState.filters)
    } catch (error) {
      handleFetchError(error, layout.dogListContainer)
    }
  }

  subscribe('stateChanged', onFiltersChanged)
  await renderDogList(layout.dogListContainer)
}

/**
 * Renders the dashboard page.
 *
 * @param {object} user - Authenticated user object.
 */
export const render = async (user) => {
  renderLoading()

  const layout = createDashboardLayout()
  const linkElements = renderNavigationBar(layout.dashboardRoot, user)

  try {
    await renderStatistics(layout, linkElements)
  } catch (error) {
    document.body.replaceChildren(layout.dashboardRoot)
    handleFetchError(error, layout.main)
  }

  try {
    await renderDogSearch(layout)
  } catch (error) {
    handleFetchError(error, layout.findDogSection)
  }
}
