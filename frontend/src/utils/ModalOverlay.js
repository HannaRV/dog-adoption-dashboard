/**
 * @file Modal overlay utility for creating a dismissible overlay.
 * @module src/utils/ModalOverlay.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Creates a modal overlay element with click-to-close behavior.
 *
 * @returns {HTMLElement} Modal overlay element.
 */
export const createModalOverlay = () => {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.remove()
  })
  return overlay
}
