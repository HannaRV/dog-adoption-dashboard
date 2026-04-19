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
 * Publishes a state event with data.
 *
 * @param {string} event - Event name.
 * @param {object} data - Event data.
 */
const publish = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach(callback => callback(data))
  }
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
 * Removes all listeners for a specific event.
 *
 * @param {string} event - Event name to reset.
 */
export const resetListeners = (event) => {
  delete listeners[event]
}
