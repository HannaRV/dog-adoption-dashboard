/**
 * @file Statistics cards component displaying boolean field percentages.
 * @module src/components/StatisticsCards.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Maps boolean field keys to their display labels.
 * @type {object}
 */
const CARD_LABELS = {
  house_trained: 'House Trained',
  env_children: 'Good with Children',
  env_dogs: 'Good with Dogs',
  env_cats: 'Good with Cats',
  fixed: 'Fixed',
  special_needs: 'Special Needs'
}

/**
 * Calculates percentage of true values for a boolean field.
 *
 * @param {{ true: number, false: number }} field - Boolean field counts.
 * @returns {number} Percentage of true values.
 */
const calculatePercentage = (field) => {
  const total = field.true + field.false
  if (total === 0) return 0
  return Math.round((field.true / total) * 100)
}

/**
 * Creates a single statistics card element.
 *
 * @param {string} label - Card label.
 * @param {number} percentage - Percentage value.
 * @returns {HTMLElement} Card element.
 */
const createCard = (label, percentage) => {
  const card = document.createElement('div')
  card.className = 'bg-white rounded-xl shadow p-4 text-center'

  const labelElement = document.createElement('p')
  labelElement.className = 'text-sm text-gray-500 mb-1'
  labelElement.textContent = label

  const percentageElement = document.createElement('p')
  percentageElement.className = 'text-3xl font-bold text-indigo-600'
  percentageElement.textContent = `${percentage}%`

  card.append(labelElement, percentageElement)
  return card
}

/**
 * Renders statistics cards into the given container.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} booleans - Boolean field data from /dogs/stats.
 */
export const renderStatisticsCards = (container, booleans) => {
  container.replaceChildren()
  container.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'

  Object.entries(CARD_LABELS).forEach(([key, label]) => {
    const field = booleans[key]
    if (!field) return
    const percentage = calculatePercentage(field)
    container.append(createCard(label, percentage))
  })
}
