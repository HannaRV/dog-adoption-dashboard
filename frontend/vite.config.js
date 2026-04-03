/**
 * @file Vite configuration.
 * @module vite.config.js
 */

import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/auth': 'http://localhost:3000'
    }
  }
})
