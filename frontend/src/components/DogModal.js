/**
 * @file Dog detail modal component.
 * @module src/components/DogModal.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getDogById } from '../api.js'
import { createModalOverlay } from '../utils/ModalOverlay.js'

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
 * Builds the dog detail rows for the modal.
 *
 * @param {object} dog - Dog data object.
 * @param {string} dog.breedPrimary - Primary breed.
 * @param {string} dog.age - Age category.
 * @param {string} dog.sex - Sex.
 * @param {string} dog.size - Size category.
 * @param {string} dog.coat - Coat type.
 * @param {string} dog.contactState - Contact state code.
 * @returns {Array<{label: string, value: string}>} Detail rows.
 */
const buildDogDetails = (dog) => [
  { label: 'Breed', value: dog.breedPrimary },
  { label: 'Age', value: dog.age },
  { label: 'Sex', value: dog.sex },
  { label: 'Size', value: dog.size },
  { label: 'Coat', value: dog.coat },
  { label: 'State', value: dog.contactState?.length === 2 ? dog.contactState : 'Unknown' }
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
  badge.className = value ? 'dog-modal-badge-true' : 'dog-modal-badge-false'
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
  row.className = 'dog-modal-detail-row'

  const labelElement = document.createElement('span')
  labelElement.className = 'dog-modal-detail-label'
  labelElement.textContent = label

  const valueElement = document.createElement('span')
  valueElement.className = 'dog-modal-detail-value'
  valueElement.textContent = value || 'Unknown'

  row.append(labelElement, valueElement)
  return row
}

/**
 * Builds the modal content element with full dog information.
 *
 * @param {object} dog - Dog data object.
 * @param {string} dog.name - Dog name.
 * @param {string} dog.description - Dog description.
 * @returns {{ modal: HTMLElement, closeButton: HTMLElement }} Modal content and close button.
 */
const createModalContent = (dog) => {
  const modal = document.createElement('div')
  modal.className = 'dog-modal'

  const header = document.createElement('div')
  header.className = 'modal-header'

  const nameElement = document.createElement('h2')
  nameElement.className = 'dog-modal-name'
  nameElement.textContent = dog.name

  const closeButton = document.createElement('button')
  closeButton.className = 'modal-close'
  closeButton.textContent = '×'

  header.append(nameElement, closeButton)

  const detailsSection = document.createElement('div')
  detailsSection.className = 'dog-modal-details'
  detailsSection.append(...buildDogDetails(dog).map(({ label, value }) => createDetailRow(label, value)))

  const badgesSection = document.createElement('div')
  badgesSection.className = 'dog-modal-badges'
  badgesSection.append(...BOOLEAN_FIELDS.map(({ key, label }) => createBooleanBadge(label, dog[key])))

  const descriptionSection = document.createElement('div')
  descriptionSection.className = 'dog-modal-description-section'

  const descriptionLabel = document.createElement('p')
  descriptionLabel.className = 'dog-modal-description-label'
  descriptionLabel.textContent = 'About'

  const descriptionText = document.createElement('p')
  descriptionText.className = 'dog-modal-description-text'
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
  const overlay = createModalOverlay()

  const loadingMessage = document.createElement('p')
  loadingMessage.className = 'modal-loading'
  loadingMessage.textContent = 'Loading details...'

  overlay.append(loadingMessage)
  document.body.append(overlay)

  try {
    const dog = await getDogById(dogId)
    overlay.replaceChildren()
    const { modal, closeButton } = createModalContent(dog)
    closeButton.addEventListener('click', () => overlay.remove())
    overlay.append(modal)
  } catch (error) {
    overlay.remove()
    throw error
  }
}
