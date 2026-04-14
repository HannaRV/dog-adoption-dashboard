/**
 * @file Dog list component with pagination.
 * @module src/components/DogList.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { getDogs } from '../api.js'
import { renderDogModal } from './DogModal.js'

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
  card.className = 'bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition-shadow'

  const name = document.createElement('h3')
  name.className = 'font-semibold text-gray-800'
  name.textContent = dog.name

  const breed = document.createElement('p')
  breed.className = 'text-sm text-gray-500'
  breed.textContent = dog.breedPrimary || 'Unknown breed'

  const details = document.createElement('div')
  details.className = 'flex gap-2 mt-2 flex-wrap'

  const tags = [dog.age, dog.sex, dog.size].filter(Boolean)
  tags.forEach(tag => {
    const span = document.createElement('span')
    span.className = 'text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full'
    span.textContent = tag
    details.append(span)
  })

  card.addEventListener('click', async () => {
    try {
      await renderDogModal(dog.id)
    } catch {
      const errorMessage = document.createElement('p')
      errorMessage.className = 'text-red-500 text-sm text-center mt-2'
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
  pagination.className = 'flex justify-center items-center gap-4 mt-6'

  const previousButton = document.createElement('button')
  previousButton.className = 'px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  previousButton.textContent = 'Previous'
  previousButton.disabled = page <= 1
  previousButton.addEventListener('click', () => onPageChange(page - 1))

  const pageInfo = document.createElement('span')
  pageInfo.className = 'text-sm text-gray-500'
  pageInfo.textContent = `Page ${page} of ${totalPages}`

  const nextButton = document.createElement('button')
  nextButton.className = 'px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  nextButton.textContent = 'Next'
  nextButton.disabled = page >= totalPages
  nextButton.addEventListener('click', () => onPageChange(page + 1))

  pagination.append(previousButton, pageInfo, nextButton)
  return pagination
}

/**
 * Renders a loading overlay on top of the container.
 *
 * @param {HTMLElement} container - Container element.
 * @returns {HTMLElement} Loading overlay element.
 */
const renderLoadingOverlay = (container) => {
  container.style.position = 'relative'

  const loadingOverlay = document.createElement('div')
  loadingOverlay.className = 'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10'

  const loadingText = document.createElement('p')
  loadingText.className = 'text-gray-500'
  loadingText.textContent = 'Loading dogs...'

  loadingOverlay.append(loadingText)
  container.append(loadingOverlay)

  return loadingOverlay
}

/**
 * Renders a paginated list of dogs into the given container.
 * Errors are propagated to the caller for centralized handling.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} [params] - Filter and pagination parameters.
 * @returns {Promise<void>}
 */
export const renderDogList = async (container, params = {}) => {
  const scrollPosition = window.scrollY
  const loadingOverlay = renderLoadingOverlay(container)

  try {
    const result = await getDogs(params)
    container.replaceChildren()
    container.style.position = ''

    if (!result.dogs.length) {
      const emptyMessage = document.createElement('p')
      emptyMessage.className = 'text-gray-500 text-center py-8'
      emptyMessage.textContent = 'No dogs found matching your filters.'
      container.append(emptyMessage)
      window.scrollTo(0, scrollPosition)
      return
    }

    const grid = document.createElement('div')
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'

    result.dogs.forEach(dog => grid.append(createDogCard(dog)))

    const pagination = createPagination(
      result._pagination.page,
      result._pagination.totalPages,
      (newPage) => renderDogList(container, { ...params, page: newPage })
    )

    container.append(grid, pagination)
    window.scrollTo(0, scrollPosition)
  } catch (error) {
    container.style.position = ''
    loadingOverlay.remove()
    throw error
  }
}
