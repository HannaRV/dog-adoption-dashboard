/**
 * @file Bar chart component for displaying dog distribution data.
 * @module src/components/BarChart.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import Plotly from 'plotly.js-dist-min'

/**
 * Renders a bar chart into the given container.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} data - Chart data with x and y arrays.
 * @param {string} title - Chart title.
 */
export const renderBarChart = (container, data, title) => {
  const trace = {
    x: data.x,
    y: data.y,
    type: 'bar',
    marker: {
      color: '#6366f1'
    }
  }

  const layout = {
    title: {
        text: title,
        font: { size: 14 }
    },
    height: 250,
    margin: { t: 40, r: 20, b: 40, l: 40 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    xaxis: { fixedrange: true },
    yaxis: { fixedrange: true }
  }

  const config = {
    responsive: true,
    displayModeBar: false
  }

  Plotly.newPlot(container, [trace], layout, config)
}
