/**
 * @file Summary bar component displaying key dataset statistics.
 * @module src/components/SummaryBar.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Finds the state code with the highest dog count.
 *
 * @param {object} stateCountsByCode - Object with state codes as keys and counts as values.
 * @returns {string} State code with the highest count.
 */
const findTopState = (stateCountsByCode) => {
  const entries = Object.entries(stateCountsByCode)
  if (!entries.length) return 'N/A'
  return entries.reduce((current, next) => next[1] > current[1] ? next : current)[0]
}

/**
 * Finds the category with the highest count in chart data.
 *
 * @param {{ x: string[], y: number[] }} chartData - Chart data with x labels and y counts.
 * @returns {string} Category label with the highest count.
 */
const findTopCategory = (chartData) => {
  if (!chartData.y.length) return 'N/A'
  const highestCount = Math.max(...chartData.y)
  const indexOfHighest = chartData.y.indexOf(highestCount)
  return chartData.x[indexOfHighest]
}

/**
 * Builds the summary statistics items for the summary bar.
 *
 * @param {object} statistics - Statistics object from API.
 * @returns {Array<{label: string, value: string}>} Summary statistics items.
 */
const buildSummaryStatistics = (statistics) => [
  { label: 'Adoptable dogs', value: statistics.summary.total.toLocaleString() },
  { label: 'Most dogs in', value: findTopState(statistics.byState) },
  { label: 'Most common age', value: findTopCategory(statistics.byAge) },
  { label: 'Most common size', value: findTopCategory(statistics.bySize) },
  { label: 'Most common sex', value: findTopCategory(statistics.bySex) }
]

/**
 * Creates a single summary statistic item element.
 *
 * @param {string} label - Statistic label.
 * @param {string} value - Statistic value.
 * @returns {HTMLElement} Summary statistic item element.
 */
const createSummaryStatisticItem = (label, value) => {
  const item = document.createElement('div')

  const labelElement = document.createElement('p')
  labelElement.className = 'summary-bar-label'
  labelElement.textContent = label

  const valueElement = document.createElement('p')
  valueElement.className = 'summary-bar-value'
  valueElement.textContent = value

  item.append(labelElement, valueElement)
  return item
}

/**
 * Renders a summary bar with key dataset statistics.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} statistics - Statistics object from API.
 */
export const renderSummaryBar = (container, statistics) => {
  const summaryBar = document.createElement('div')
  summaryBar.className = 'summary-bar'
  summaryBar.append(...buildSummaryStatistics(statistics).map(({ label, value }) => createSummaryStatisticItem(label, value)))

  container.append(summaryBar)
}
