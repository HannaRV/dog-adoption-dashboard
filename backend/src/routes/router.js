/**
 * @file Main application router.
 * @module src/routes/router.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'

/**
 * Creates the main application router with injected sub-routers.
 *
 * @param {object} authRouter - Authentication router instance.
 * @param {object} dogRouter - Dog data router instance.
 * @returns {object} Configured Express router.
 */
export const createRouter = (authRouter, dogRouter) => {
  const router = express.Router()

  router.use('/auth', authRouter)
  router.use('/api', dogRouter)

  router.use((req, res, next) => {
    const error = new Error('The requested resource was not found.')
    error.status = 404
    next(error)
  })

  return router
}
