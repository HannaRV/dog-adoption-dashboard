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
const findTopState = (stateCountsByCode) =>
  Object.entries(stateCountsByCode)
    .reduce((current, next) => next[1] > current[1] ? next : current)[0]

/**
 * Finds the category with the highest count in chart data.
 *
 * @param {{ x: string[], y: number[] }} chartData - Chart data with x labels and y counts.
 * @returns {string} Category label with the highest count.
 */
const findTopCategory = (chartData) => {
  const highestCount = Math.max(...chartData.y)
  const indexOfHighest = chartData.y.indexOf(highestCount)
  return chartData.x[indexOfHighest]
}

/**
 * Creates a single summary stat item element.
 *
 * @param {string} label - Stat label.
 * @param {string} value - Stat value.
 * @returns {HTMLElement} Summary stat element.
 */
const createSummaryStatItem = (label, value) => {
  const item = document.createElement('div')

  const labelElement = document.createElement('p')
  labelElement.className = 'text-indigo-200 text-xs uppercase tracking-wide'
  labelElement.textContent = label

  const valueElement = document.createElement('p')
  valueElement.className = 'text-white text-xl font-bold'
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
  const topState = findTopState(statistics.byState)
  const topAge = findTopCategory(statistics.byAge)

  const summaryItems = [
  { label: 'Adoptable dogs', value: statistics.summary.total.toLocaleString() },
  { label: 'Most dogs in', value: topState },
  { label: 'Most common age', value: topAge },
  { label: 'Most common size', value: findTopCategory(statistics.bySize) },
  { label: 'Most common sex', value: findTopCategory(statistics.bySex) }
]

  const summaryBar = document.createElement('div')
  summaryBar.className = 'bg-indigo-600 text-white rounded-xl px-6 py-4 flex flex-wrap gap-6 items-center justify-between w-full'

  summaryItems.forEach(({ label, value }) => {
    summaryBar.append(createSummaryStatItem(label, value))
  })

  container.append(summaryBar)
}