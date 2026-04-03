/**
 * @file Login page.
 * @module src/pages/login.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Renders the login page.
 */
export const render = () => {
  document.body.innerHTML = `
    <div class="login-container">
      <h1>Dog Adoption Dashboard</h1>
      <a href="/auth/github/login" class="login-button">Sign in with GitHub</a>
    </div>
  `
}