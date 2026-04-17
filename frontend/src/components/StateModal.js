/**
 * @file State modal component displaying dog statistics for a US state.
 * @module src/components/StateModal.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getDogsByState } from '../api.js'
import { createModalOverlay } from '../utils/ModalOverlay.js'

/**
 * Finds the most common value in an array of strings.
 *
 * @param {string[]} values - Array of string values.
 * @returns {string} Most common value.
 */
const findMostCommon = (values) => {
  if (!values.length) return 'Unknown'
  const counts = values.reduce((acc, value) => {
    if (value) acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0]
}

/**
 * Builds the statistics items for a state modal.
 *
 * @param {object} result - API result object.
 * @returns {Array<{label: string, value: string}>} Statistics items.
 */
const buildStateStatistics = (result) => [
  { label: 'Adoptable Dogs', value: result._pagination.totalDogs.toLocaleString() },
  { label: 'Most Common Breed', value: findMostCommon(result.dogs.map(dog => dog.breedPrimary).filter(Boolean)) },
  { label: 'Most Common Age', value: findMostCommon(result.dogs.map(dog => dog.age).filter(Boolean)) },
  { label: 'Most Common Size', value: findMostCommon(result.dogs.map(dog => dog.size).filter(Boolean)) }
]

/**
 * Creates a stat item element.
 *
 * @param {string} label - Stat label.
 * @param {string} value - Stat value.
 * @returns {HTMLElement} Stat item element.
 */
const createStatisticItem = (label, value) => {
  const item = document.createElement('div')

  const labelElement = document.createElement('p')
  labelElement.className = 'state-modal-stat-label'
  labelElement.textContent = label

  const valueElement = document.createElement('p')
  valueElement.className = 'state-modal-stat-value'
  valueElement.textContent = value

  item.append(labelElement, valueElement)
  return item
}

/**
 * Renders a modal with dog statistics for a specific US state.
 * Shows a loading state while fetching data.
 * Errors are silently ignored — map interaction is non-critical.
 *
 * @param {string} stateName - Full state name (e.g. 'California').
 * @param {string} stateCode - State code (e.g. 'CA').
 * @returns {Promise<void>}
 */
export const renderStateModal = async (stateName, stateCode) => {
  const overlay = createModalOverlay()

  const loadingMessage = document.createElement('p')
  loadingMessage.className = 'modal-loading'
  loadingMessage.textContent = 'Loading state statistics...'

  overlay.append(loadingMessage)
  document.body.append(overlay)

  try {
    const result = await getDogsByState(stateCode)

    const modal = document.createElement('div')
    modal.className = 'state-modal'

    const header = document.createElement('div')
    header.className = 'modal-header'

    const title = document.createElement('h2')
    title.className = 'state-modal-title'
    title.textContent = stateName

    const closeButton = document.createElement('button')
    closeButton.className = 'modal-close'
    closeButton.textContent = '×'
    closeButton.addEventListener('click', () => overlay.remove())

    header.append(title, closeButton)

    const statisticsGrid = document.createElement('div')
    statisticsGrid.className = 'state-modal-grid'
    statisticsGrid.append(...buildStateStatistics(result).map(({ label, value }) => createStatisticItem(label, value)))

    modal.append(header, statisticsGrid)
    overlay.replaceChildren(modal)
  } catch {
    overlay.remove()
  }
}
