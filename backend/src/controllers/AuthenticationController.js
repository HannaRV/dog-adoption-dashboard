/**
 * @file Authentication controller handling OAuth flow.
 * @module src/controllers/AuthenticationController.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import crypto from 'crypto'

import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js'

/**
 * Handles GitHub OAuth authentication flow.
 */
export class AuthenticationController {
  #oauthService
  #tokenService
  #auditLogger
  #clientUrl

  /**
   * @param {import('../services/OAuthService.js').OAuthService} oauthService - Injected OAuth service.
   * @param {import('../services/TokenService.js').TokenService} tokenService - Injected token service.
   * @param {import('../utils/AuditLogger.js').AuditLogger} auditLogger - Injected audit logger.
   * @param {string} clientUrl - Frontend client URL.
   */
  constructor (oauthService, tokenService, auditLogger, clientUrl) {
    this.#oauthService = oauthService
    this.#tokenService = tokenService
    this.#auditLogger = auditLogger
    this.#clientUrl = clientUrl
  }

  /**
   * Initiates GitHub OAuth flow.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  login (req, res, next) {
    const state = crypto.randomBytes(16).toString('hex')
    req.session.oauthState = state
    req.session.save((err) => {
      if (err) return next(err)
      const authUrl = this.#oauthService.getAuthorizationUrl(state)
      res.redirect(authUrl)
    })
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
      const jwt = await this.#tokenService.requestToken('github', profile.id, profile.email, profile.login)

      req.session.regenerate((err) => {
        if (err) return next(err)
        req.session.user = {
          email: profile.email,
          username: profile.login,
          providerId: profile.id
        }
        req.session.jwt = jwt
        this.#auditLogger.log('OAUTH_LOGIN_SUCCESS', req, { username: profile.login })
        res.redirect(`${this.#clientUrl}/dashboard`)
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
      res.redirect(this.#clientUrl)
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
