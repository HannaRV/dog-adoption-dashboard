/**
 * @file Main application router.
 * @module src/routes/router.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'

import { AuthenticationRouter } from './AuthenticationRouter.js'
import { DogRouter } from './DogRouter.js'

export const router = express.Router()

router.use('/auth', new AuthenticationRouter().getRouter())
router.use('/api', new DogRouter().getRouter())

router.use((req, res, next) => {
  const error = new Error('The requested resource was not found.')
  error.status = 404
  next(error)
})
