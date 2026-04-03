/**
 * @file Dashboard page.
 * @module src/pages/dashboard.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Renders the dashboard page.
 */
export const render = () => {
  document.body.innerHTML = `
    <div class="dashboard-container">
      <h1>Dog Adoption Dashboard</h1>
      <p>Welcome! You are logged in.</p>
      <a href="/auth/logout">Logout</a>
    </div>
  `
}
