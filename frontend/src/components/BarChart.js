/**
 * @file Bar chart component for displaying dog distribution data.
 * @module src/components/BarChart.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import Plotly from 'plotly.js-dist-min'

/** @type {string} */
const CHART_COLOR = '#6366f1'

/**
 * X-axis label abbreviations.
 * Used where full labels don't fit under bar chart columns.
 * Currently only 'Extra Large' requires abbreviation; more may be added as needed.
 *
 * @type {object}
 */
const SIZE_LABEL_ABBREVIATIONS = {
  'Extra Large': 'XL'
}

/**
 * Abbreviates x-axis labels for display purposes.
 *
 * @param {string[]} labels - Original x-axis labels.
 * @returns {string[]} Abbreviated labels.
 */
const abbreviateLabels = (labels) =>
  labels.map(label => SIZE_LABEL_ABBREVIATIONS[label] ?? label)

/**
 * Renders a bar chart into the given container.
 *
 * @param {HTMLElement} container - Container element.
 * @param {{ x: string[], y: number[] }} data - Chart data with x labels and y counts.
 * @param {string} title - Chart title.
 */
export const renderBarChart = (container, data, title) => {
  const trace = {
    x: data.x,
    y: data.y,
    type: 'bar',
    marker: {
      color: CHART_COLOR
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
    xaxis: {
      fixedrange: true,
      ticktext: abbreviateLabels(data.x),
      tickvals: data.x
    },
    yaxis: { fixedrange: true }
  }

  const config = {
    responsive: true,
    displayModeBar: false
  }

  Plotly.newPlot(container, [trace], layout, config)
}
