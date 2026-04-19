/**
 * @file Application entry point.
 * @module src/app.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import 'dotenv/config'

import ExpressApplication from './config/express.js'

const DEFAULT_PORT = 3000

const PORT = process.env.PORT || DEFAULT_PORT

const expressApplication = new ExpressApplication()
const server = expressApplication.getApp().listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
process.on('SIGINT', () => server.close(() => process.exit(0)))
