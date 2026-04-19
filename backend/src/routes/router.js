/**
 * @file Main application router.
 * @module src/routes/router.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { NotFoundError } from '../utils/errors/NotFoundError.js'

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
  router.use('/api/v1', dogRouter)

  router.use((req, res, next) => {
    next(new NotFoundError())
  })

  return router
}
