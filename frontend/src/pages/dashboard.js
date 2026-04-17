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
  const errorMsg = document.createElement('p')
  errorMsg.className = 'error-message'
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
  const app = document.createElement('div')
  app.className = 'dashboard-app'

  const main = document.createElement('main')
  main.className = 'dashboard-main'

  // Overview section — wraps heading, summary and charts
  const overviewSection = document.createElement('section')
  overviewSection.id = 'summary'

  const summarySection = document.createElement('div')
  const booleanChartSection = document.createElement('div')
  booleanChartSection.id = 'boolean-chart'

  const chartsSection = document.createElement('div')
  chartsSection.className = 'dashboard-charts'

  const ageChartWrapper = document.createElement('div')
  const ageChartContainer = document.createElement('div')
  ageChartContainer.className = 'chart-container-age'
  const chartsFootnote = document.createElement('p')
  chartsFootnote.className = 'chart-footnote'
  chartsFootnote.textContent = 'Age categories as defined by Petfinder.'
  ageChartWrapper.append(ageChartContainer, chartsFootnote)

  const sizeChartContainer = document.createElement('div')
  sizeChartContainer.className = 'chart-container-size'

  const sexChartContainer = document.createElement('div')
  sexChartContainer.className = 'chart-container-sex'

  chartsSection.append(ageChartWrapper, sizeChartContainer, sexChartContainer, booleanChartSection)

  overviewSection.append(
    createSectionHeading('Overview'),
    summarySection,
    chartsSection
  )

  // Map section
  const mapSection = document.createElement('section')
  mapSection.id = 'map'
  mapSection.className = 'map-section'
  mapSection.style.height = '600px'

  // Find a dog section — wraps heading, filter and dog list
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

  const footer = document.createElement('footer')
  footer.className = 'dashboard-footer'

  const footerLeft = document.createElement('span')
  footerLeft.className = 'dashboard-footer-left'
  footerLeft.textContent = 'Data sourced from Petfinder via Kaggle'

  const footerRight = document.createElement('span')
  footerRight.className = 'dashboard-footer-right'
  footerRight.textContent = '© 2026 Hanna Rubio Vretby'

  footer.append(footerLeft, footerRight)
  app.append(main, footer)

  return {
    app,
    main,
    summarySection,
    booleanChartSection,
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
 * Renders the dashboard page.
 *
 * @param {object} user - Authenticated user object.
 */
export const render = async (user) => {
  renderLoading()

  const {
    app,
    main,
    summarySection,
    booleanChartSection,
    ageChartContainer,
    sizeChartContainer,
    sexChartContainer,
    mapSection,
    filterContainer,
    dogListContainer,
    findDogSection
  } = createDashboardLayout()

  const linkElements = renderNavigationBar(app, user)

  try {
    const statistics = await getStatistics()

    document.body.replaceChildren(app)
    setupActiveState(linkElements)

    renderSummaryBar(summarySection, statistics)
    renderBooleanChart(booleanChartSection, statistics.booleans)
    renderBarChart(ageChartContainer, sortByOrder(statistics.byAge, AGE_ORDER), 'Age Distribution')
    renderBarChart(sizeChartContainer, sortByOrder(statistics.bySize, SIZE_ORDER), 'Size Distribution')
    renderBarChart(sexChartContainer, filterChartData(statistics.bySex, 'Unknown'), 'Sex Distribution')
    await renderDogMap(mapSection, statistics.byState, statistics.summary.total)
  } catch (error) {
    document.body.replaceChildren(app)
    handleFetchError(error, main)
  }

  try {
    renderFilterPanel(filterContainer)

    const onFiltersChanged = async (newState) => {
      try {
        await renderDogList(dogListContainer, newState.filters)
      } catch (error) {
        handleFetchError(error, dogListContainer)
      }
    }

    subscribe('stateChanged', onFiltersChanged)
    await renderDogList(dogListContainer)
  } catch (error) {
    handleFetchError(error, findDogSection)
  }
}
