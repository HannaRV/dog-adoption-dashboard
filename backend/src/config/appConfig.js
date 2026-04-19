/**
 * @file Application configuration loaded from environment variables.
 * @module src/config/appConfig.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Reads a required environment variable, throwing if missing.
 *
 * @param {string} name - Environment variable name.
 * @returns {string} The environment variable value.
 */
const required = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const APP_CONFIG = Object.freeze({
  clientUrl: required('CLIENT_URL'),
  sessionSecret: required('SESSION_SECRET'),
  mongoDbUri: required('MONGODB_URI'),
  dogApiUrl: required('DOG_API_URL'),
  github: Object.freeze({
    clientId: required('GITHUB_CLIENT_ID'),
    clientSecret: required('GITHUB_CLIENT_SECRET'),
    callbackUrl: required('GITHUB_CALLBACK_URL')
  })
})
