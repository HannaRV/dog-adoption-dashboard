/**
 * @file State management using pub/sub pattern.
 * @module src/state.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Registry of event listeners grouped by event name.
 * @type {object.<string, Function[]>}
 */
const listeners = {}

/**
 * Current application state.
 * @type {object}
 */
let state = {
  filters: {}
}

/**
 * Updates the application state and notifies subscribers.
 *
 * @param {object} updates - Partial state updates.
 */
export const setState = (updates) => {
  state = { ...state, ...updates }
  publish('stateChanged', state)
}

/**
 * Subscribes to a state event.
 *
 * @param {string} event - Event name.
 * @param {Function} callback - Callback function.
 */
export const subscribe = (event, callback) => {
  if (!listeners[event]) {
    listeners[event] = []
  }
  listeners[event].push(callback)
}

/**
 * Publishes a state event with data.
 *
 * @param {string} event - Event name.
 * @param {object} data - Event data.
 */
export const publish = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach(callback => callback(data))
  }
}

/**
 * Unsubscribes a callback from a state event.
 * Part of the pub/sub API — available for components that need
 * to clean up listeners during their lifecycle.
 *
 * @param {string} event - Event name.
 * @param {Function} callback - Callback function to remove.
 */
export const unsubscribe = (event, callback) => {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter(fn => fn !== callback)
  }
}

/**
 * Removes all listeners for a specific event.
 *
 * @param {string} event - Event name to reset.
 */
export const resetListeners = (event) => {
  delete listeners[event]
}
