/**
 * @file Authentication controller handling OAuth flow.
 * @module src/controllers/AuthenticationController.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import crypto from 'crypto'

import { OAuthService } from '../services/OAuthService.js'
import { TokenService } from '../services/TokenService.js'
import { AuditLogger } from '../middleware/AuditLogger.js'
import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js'

/**
 * Handles GitHub OAuth authentication flow.
 */
export class AuthenticationController {
  #oauthService
  #tokenService
  #auditLogger

  /**
   * @param {OAuthService} [oauthService] - Injected for testing.
   * @param {TokenService} [tokenService] - Injected for testing.
   * @param {AuditLogger} [auditLogger] - Injected for testing.
   */
  constructor (
    oauthService = new OAuthService(),
    tokenService = new TokenService(),
    auditLogger = new AuditLogger()
  ) {
    this.#oauthService = oauthService
    this.#tokenService = tokenService
    this.#auditLogger = auditLogger
  }

  /**
   * Initiates GitHub OAuth flow.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  login (req, res) {
    const state = crypto.randomBytes(16).toString('hex')
    req.session.oauthState = state
    const authUrl = this.#oauthService.getAuthorizationUrl(state)
    res.redirect(authUrl)
  }

  /**
   * Handles GitHub OAuth callback.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async callback (req, res, next) {
    try {
      const { code, state } = req.query

      if (!state || state !== req.session.oauthState) {
        this.#auditLogger.log('OAUTH_LOGIN_FAILURE', req, { reason: 'Invalid state parameter' })
        throw new UnauthorizedError('Invalid OAuth state parameter')
      }

      delete req.session.oauthState

      const accessToken = await this.#oauthService.exchangeCodeForToken(code)
      const profile = await this.#oauthService.getUserProfile(accessToken)
      const jwt = await this.#tokenService.getToken(profile.email, profile.login)

      req.session.regenerate((err) => {
        if (err) return next(err)
        req.session.user = { email: profile.email, username: profile.login }
        req.session.jwt = jwt
        this.#auditLogger.log('OAUTH_LOGIN_SUCCESS', req, { username: profile.login })
        res.redirect('http://localhost:5173/dashboard')
      })
    } catch (error) {
      this.#auditLogger.log('OAUTH_LOGIN_FAILURE', req, { reason: error.message })
      next(error)
    }
  }

  /**
   * Logs out the user by destroying the session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  logout (req, res, next) {
    this.#auditLogger.log('LOGOUT', req, { username: req.session?.user?.username })
    req.session.destroy((err) => {
      if (err) return next(err)
      res.redirect('http://localhost:5173')
    })
  }

  /**
   * Returns the current authentication status.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  status (req, res) {
    if (req.session?.user) {
      return res.json({ authenticated: true, user: req.session.user })
    }
    res.json({ authenticated: false })
  }
}
