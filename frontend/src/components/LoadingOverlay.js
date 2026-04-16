/**
 * @file Loading overlay component.
 * @module src/components/LoadingOverlay.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Renders a loading overlay on top of the container.
 * Returns a cleanup function that removes the overlay and resets positioning.
 *
 * @param {HTMLElement} container - Container element.
 * @param {string} [message] - Loading message to display.
 * @returns {Function} Cleanup function to remove the overlay.
 */
export const renderLoadingOverlay = (container, message = 'Loading...') => {
  container.style.position = 'relative'

  const loadingOverlay = document.createElement('div')
  loadingOverlay.className = 'loading-overlay'

  const loadingText = document.createElement('p')
  loadingText.className = 'loading-overlay-text'
  loadingText.textContent = message

  loadingOverlay.append(loadingText)
  container.append(loadingOverlay)

  return () => {
    loadingOverlay.remove()
    container.style.position = ''
  }
}