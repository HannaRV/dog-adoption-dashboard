/**
 * @file State modal component displaying dog statistics for a US state.
 * @module src/components/StateModal.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getDogsByState } from '../api.js'

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
 * Creates a stat item element.
 *
 * @param {string} label - Stat label.
 * @param {string} value - Stat value.
 * @returns {HTMLElement} Stat item element.
 */
const createStatItem = (label, value) => {
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
 * Errors are propagated to the caller for centralized handling.
 *
 * @param {string} stateName - Full state name (e.g. 'California').
 * @param {string} stateCode - State code (e.g. 'CA').
 * @param {number} totalDogs - Total number of dogs in the dataset.
 * @returns {Promise<void>}
 */
export const renderStateModal = async (stateName, stateCode) => {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const loadingMessage = document.createElement('p')
  loadingMessage.className = 'modal-loading'
  loadingMessage.textContent = 'Loading state statistics...'

  overlay.append(loadingMessage)
  document.body.append(overlay)

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.remove()
  })

  try {
    const result = await getDogsByState(stateCode)
    const dogs = result.dogs

    const breeds = dogs.map(dog => dog.breedPrimary).filter(Boolean)
    const ages = dogs.map(dog => dog.age).filter(Boolean)
    const sizes = dogs.map(dog => dog.size).filter(Boolean)

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

    const statsGrid = document.createElement('div')
    statsGrid.className = 'state-modal-grid'

    const dogsInState = result._pagination.totalDogs

    const stats = [
      { label: 'Adoptable Dogs', value: dogsInState.toLocaleString() },
      { label: 'Most Common Breed', value: findMostCommon(breeds) },
      { label: 'Most Common Age', value: findMostCommon(ages) },
      { label: 'Most Common Size', value: findMostCommon(sizes) }
    ]

    stats.forEach(({ label, value }) => {
      statsGrid.append(createStatItem(label, value))
    })

    modal.append(header, statsGrid)
    overlay.replaceChildren(modal)
  } catch {
    overlay.remove()
  }
}
