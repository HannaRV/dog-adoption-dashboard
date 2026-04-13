/**
 * @file Dog detail modal component.
 * @module src/components/DogModal.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getDogById } from '../api.js'

/**
 * Boolean field display configuration.
 * @type {Array<{key: string, label: string}>}
 */
const BOOLEAN_FIELDS = [
  { key: 'houseTrained', label: 'House Trained' },
  { key: 'fixed', label: 'Fixed' },
  { key: 'shotsCurrent', label: 'Shots Current' },
  { key: 'specialNeeds', label: 'Special Needs' },
  { key: 'envChildren', label: 'Good with Children' },
  { key: 'envDogs', label: 'Good with Dogs' },
  { key: 'envCats', label: 'Good with Cats' }
]

/**
 * Creates a boolean field badge element.
 *
 * @param {string} label - Badge label.
 * @param {boolean} value - Boolean value.
 * @returns {HTMLElement} Badge element.
 */
const createBooleanBadge = (label, value) => {
  const badge = document.createElement('span')
  badge.className = value
    ? 'text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full'
    : 'text-xs bg-gray-50 text-gray-400 px-2 py-1 rounded-full line-through'
  badge.textContent = label
  return badge
}

/**
 * Creates a detail row element with label and value.
 *
 * @param {string} label - Row label.
 * @param {string} value - Row value.
 * @returns {HTMLElement} Detail row element.
 */
const createDetailRow = (label, value) => {
  const row = document.createElement('div')
  row.className = 'flex gap-2'

  const labelElement = document.createElement('span')
  labelElement.className = 'text-sm text-gray-500 w-24 shrink-0'
  labelElement.textContent = label

  const valueElement = document.createElement('span')
  valueElement.className = 'text-sm text-gray-800 font-medium'
  valueElement.textContent = value || 'Unknown'

  row.append(labelElement, valueElement)
  return row
}

/**
 * Builds the modal content element with full dog information.
 *
 * @param {object} dog - Dog data object.
 * @returns {HTMLElement} Modal content element.
 */
const createModalContent = (dog) => {
  const modal = document.createElement('div')
  modal.className = 'bg-white rounded-xl shadow-xl max-w-lg w-full max-h-screen overflow-y-auto p-6'

  // Header
  const header = document.createElement('div')
  header.className = 'flex justify-between items-start mb-4'

  const nameElement = document.createElement('h2')
  nameElement.className = 'text-xl font-bold text-gray-800'
  nameElement.textContent = dog.name

  const closeButton = document.createElement('button')
  closeButton.className = 'text-gray-400 hover:text-gray-600 text-2xl leading-none'
  closeButton.textContent = '×'

  header.append(nameElement, closeButton)

  // Details
  const detailsSection = document.createElement('div')
  detailsSection.className = 'space-y-2 mb-4'

  const details = [
    { label: 'Breed', value: dog.breedPrimary },
    { label: 'Age', value: dog.age },
    { label: 'Sex', value: dog.sex },
    { label: 'Size', value: dog.size },
    { label: 'Coat', value: dog.coat },
    { label: 'State', value: dog.contactState }
  ]

  details.forEach(({ label, value }) => {
    detailsSection.append(createDetailRow(label, value))
  })

  // Boolean badges
  const badgesSection = document.createElement('div')
  badgesSection.className = 'flex flex-wrap gap-2 mb-4'

  BOOLEAN_FIELDS.forEach(({ key, label }) => {
    badgesSection.append(createBooleanBadge(label, dog[key]))
  })

  // Description
  const descriptionSection = document.createElement('div')
  descriptionSection.className = 'border-t border-gray-100 pt-4'

  const descriptionLabel = document.createElement('p')
  descriptionLabel.className = 'text-xs text-gray-500 uppercase tracking-wide mb-2'
  descriptionLabel.textContent = 'About'

  const descriptionText = document.createElement('p')
  descriptionText.className = 'text-sm text-gray-700 leading-relaxed'
  descriptionText.textContent = dog.description || 'No description available.'

  descriptionSection.append(descriptionLabel, descriptionText)
  modal.append(header, detailsSection, badgesSection, descriptionSection)

  return { modal, closeButton }
}

/**
 * Renders a modal with detailed dog information.
 * Shows a loading state while fetching data.
 * Errors are propagated to the caller for centralized handling.
 *
 * @param {string} dogId - Dog ID to fetch and display.
 * @returns {Promise<void>}
 */
export const renderDogModal = async (dogId) => {
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-white/30'

  const loadingMessage = document.createElement('p')
  loadingMessage.className = 'text-gray-500 text-lg'
  loadingMessage.textContent = 'Loading details...'

  overlay.append(loadingMessage)
  document.body.append(overlay)

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.remove()
  })

  const dog = await getDogById(dogId)

  overlay.replaceChildren()

  const { modal, closeButton } = createModalContent(dog)

  closeButton.addEventListener('click', () => overlay.remove())

  overlay.append(modal)
}
