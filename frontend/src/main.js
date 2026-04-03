/**
 * @file Application entry point.
 * @module src/main.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { render } from './router.js'

window.addEventListener('popstate', () => render())

render()
