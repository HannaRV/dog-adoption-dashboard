/**
 * @file State management using pub/sub pattern.
 * @module src/state.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

const listeners = {}

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
 *
 * @param {string} event - Event name.
 * @param {Function} callback - Callback function to remove.
 */
export const unsubscribe = (event, callback) => {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter(fn => fn !== callback)
  }
}
