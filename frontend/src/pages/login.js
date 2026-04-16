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
  const container = document.createElement('div')
  container.className = 'min-h-screen flex items-center justify-center relative overflow-hidden'
  container.style.background = '#eef2ff'
  container.style.backgroundImage = 'radial-gradient(circle, #c7d2fe 1.5px, transparent 1.5px)'
  container.style.backgroundSize = '24px 24px'

  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(80px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.append(style)

  const card = document.createElement('div')
  card.className = 'bg-white rounded-2xl p-10 max-w-2xl w-full flex items-center gap-12 relative z-10'
  card.style.boxShadow = '0 8px 40px rgba(99,102,241,0.18)'
  card.style.border = '0.5px solid #e0e7ff'
  card.style.animation = 'fadeSlideUp 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards'

  const img = document.createElement('img')
  img.src = '/assets/dog.jpg'
  img.alt = 'A happy dalmatian dog'
  img.className = 'w-48 h-48 object-contain flex-shrink-0'

  const textSide = document.createElement('div')
  textSide.className = 'flex flex-col items-start gap-3'

  const label = document.createElement('p')
  label.className = 'text-xs text-indigo-500 uppercase tracking-widest'
  label.textContent = 'Petfinder · Kaggle'

  const heading = document.createElement('h1')
  heading.className = 'text-3xl font-bold text-indigo-950 leading-tight'
  heading.textContent = 'Find your perfect dog companion'

  const description = document.createElement('p')
  description.className = 'text-gray-400 text-sm'
  description.textContent = 'Explore ~58,000 adoptable dogs across the United States'

  const link = document.createElement('a')
  link.href = '/auth/github/login'
  link.className = 'inline-flex items-center gap-2 bg-indigo-950 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition-colors font-medium text-sm mt-2'
  link.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> Sign in with GitHub`

  textSide.append(label, heading, description, link)
  card.append(img, textSide)
  container.append(card)
  document.body.replaceChildren(container)
}
