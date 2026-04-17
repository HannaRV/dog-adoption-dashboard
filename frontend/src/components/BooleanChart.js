/**
 * @file Boolean chart component displaying boolean field percentages as progress bars.
 * @module src/components/BooleanChart.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Maps boolean field keys to their display labels.
 * @type {object}
 */
const BOOLEAN_FIELD_LABELS = {
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
 * Creates a single boolean chart progress bar item.
 *
 * @param {string} label - Field label.
 * @param {number} percentage - Percentage value.
 * @returns {HTMLElement} Progress bar item element.
 */
const createProgressItem = (label, percentage) => {
  const item = document.createElement('div')
  item.className = 'boolean-chart-item'

  const labelRow = document.createElement('div')
  labelRow.className = 'boolean-chart-label-row'

  const labelElement = document.createElement('span')
  labelElement.className = 'boolean-chart-label'
  labelElement.textContent = label

  const valueElement = document.createElement('span')
  valueElement.className = 'boolean-chart-value'
  valueElement.textContent = `${percentage}%`

  labelRow.append(labelElement, valueElement)

  const track = document.createElement('div')
  track.className = 'boolean-chart-track'

  const fill = document.createElement('div')
  fill.className = 'boolean-chart-fill'
  fill.style.width = `${percentage}%`

  track.append(fill)
  item.append(labelRow, track)
  return item
}

/**
 * Renders boolean field statistics as progress bars into the given container.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} booleans - Boolean field data from /dogs/stats.
 */
export const renderBooleanChart = (container, booleans) => {
  container.replaceChildren()
  container.className = 'boolean-chart-container'

  Object.entries(BOOLEAN_FIELD_LABELS).forEach(([key, label]) => {
    const field = booleans[key]
    if (!field) return
    const percentage = calculatePercentage(field)
    container.append(createProgressItem(label, percentage))
  })
}