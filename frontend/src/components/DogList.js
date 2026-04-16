/**
 * @file Dog list component with pagination.
 * @module src/components/DogList.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getDogs } from '../api.js'
import { renderDogModal } from './DogModal.js'
import { renderLoadingOverlay } from './LoadingOverlay.js'

/**
 * Creates a single dog card element.
 *
 * @param {object} dog - Dog data object.
 * @param {string} dog.name - Dog name.
 * @param {string} dog.breedPrimary - Primary breed.
 * @param {string} dog.age - Age category.
 * @param {string} dog.sex - Sex.
 * @param {string} dog.size - Size category.
 * @returns {HTMLElement} Dog card element.
 */
const createDogCard = (dog) => {
  const card = document.createElement('div')
  card.className = 'dog-card'

  const name = document.createElement('h3')
  name.className = 'dog-card-name'
  name.textContent = dog.name

  const breed = document.createElement('p')
  breed.className = 'dog-card-breed'
  breed.textContent = dog.breedPrimary || 'Unknown breed'

  const details = document.createElement('div')
  details.className = 'dog-card-details'

  const tags = [dog.age, dog.sex, dog.size].filter(Boolean)
  tags.forEach(tag => {
    const span = document.createElement('span')
    span.className = 'dog-card-tag'
    span.textContent = tag
    details.append(span)
  })

  card.addEventListener('click', async () => {
    try {
      await renderDogModal(dog.id)
    } catch {
      const errorMessage = document.createElement('p')
      errorMessage.className = 'dog-card-error'
      errorMessage.textContent = 'Failed to load dog details. Please try again.'
      card.append(errorMessage)
    }
  })

  card.append(name, breed, details)
  return card
}

/**
 * Creates pagination controls.
 *
 * @param {number} page - Current page.
 * @param {number} totalPages - Total number of pages.
 * @param {Function} onPageChange - Callback for page change.
 * @returns {HTMLElement} Pagination element.
 */
const createPagination = (page, totalPages, onPageChange) => {
  const pagination = document.createElement('div')
  pagination.className = 'pagination'

  const previousButton = document.createElement('button')
  previousButton.className = 'pagination-button'
  previousButton.textContent = 'Previous'
  previousButton.disabled = page <= 1
  previousButton.addEventListener('click', () => onPageChange(page - 1))

  const pageInfo = document.createElement('span')
  pageInfo.className = 'pagination-info'
  pageInfo.textContent = `Page ${page} of ${totalPages}`

  const nextButton = document.createElement('button')
  nextButton.className = 'pagination-button'
  nextButton.textContent = 'Next'
  nextButton.disabled = page >= totalPages
  nextButton.addEventListener('click', () => onPageChange(page + 1))

  pagination.append(previousButton, pageInfo, nextButton)
  return pagination
}

/**
 * Renders a paginated list of dogs into the given container.
 * Errors are propagated to the caller for centralized handling.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} [params] - Filter and pagination parameters.
 * @returns {Promise<void>}
 */
let currentRequest = null

export const renderDogList = async (container, params = {}) => {
  if (currentRequest) {
    currentRequest.abort()
  }

  currentRequest = new AbortController()
  const { signal } = currentRequest

  const scrollPosition = window.scrollY
  const cleanup = renderLoadingOverlay(container, 'Loading dogs...')

  try {
    const result = await getDogs(params, signal)
    currentRequest = null
    cleanup()
    container.replaceChildren()

    if (!result.dogs.length) {
      const emptyMessage = document.createElement('p')
      emptyMessage.className = 'dog-list-empty'
      emptyMessage.textContent = 'No dogs found matching your filters.'
      container.append(emptyMessage)
      window.scrollTo(0, scrollPosition)
      return
    }

    const grid = document.createElement('div')
    grid.className = 'dog-grid'

    result.dogs.forEach(dog => grid.append(createDogCard(dog)))

    const pagination = createPagination(
      result._pagination.page,
      result._pagination.totalPages,
      (newPage) => renderDogList(container, { ...params, page: newPage })
    )

    container.append(grid, pagination)
    window.scrollTo(0, scrollPosition)
  } catch (error) {
    if (error.name === 'AbortError') return
    cleanup()
    throw error
  }
}
