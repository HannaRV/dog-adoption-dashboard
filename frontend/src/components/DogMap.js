/**
 * @file Dog map component displaying dog distribution across US states.
 * @module src/components/DogMap.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import * as echarts from 'echarts'
import { renderStateModal } from './StateModal.js'

/**
 * Maps US state codes to their full names.
 * @type {object}
 */
const STATE_CODES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii',
  ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska',
  NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
}

/** @type {string[]} */
const MAP_COLOR_RANGE = ['#e0e7ff', '#4338ca']

/** @type {string} */
const MAP_LABEL_COLOR = '#9ca3af'

/** @type {string} */
const MAP_EMPHASIS_COLOR = '#818cf8'

/**
 * Finds the state code for a given state name.
 *
 * @param {string} stateName - Full state name.
 * @returns {string|null} State code or null if not found.
 */
const findStateCode = (stateName) =>
  Object.entries(STATE_CODES).find(([, name]) => name === stateName)?.[0] ?? null

/**
 * Loads the US GeoJSON data from the assets folder.
 *
 * @returns {Promise<object>} GeoJSON data.
 */
const loadGeoJson = async () =>
  fetch('/assets/geodata/us-states.json').then(response => response.json())

/**
 * Builds ECharts map data from state counts.
 *
 * @param {object} byState - State data object with state codes as keys and counts as values.
 * @returns {Array<{name: string, value: number}>} ECharts map data.
 */
const buildMapData = (byState) =>
  Object.entries(byState)
    .filter(([code]) => STATE_CODES[code])
    .map(([code, value]) => ({ name: STATE_CODES[code], value }))

/**
 * Builds the ECharts map option object.
 *
 * @param {Array<{name: string, value: number}>} data - Map data.
 * @param {object} byState - State data object with state codes as keys and counts as values.
 * @returns {object} ECharts option object.
 */
const buildMapOption = (data, byState) => ({
  title: {
    text: 'Dogs by State',
    left: 'center',
    textStyle: { fontSize: 14 }
  },
  graphic: [
    {
      type: 'text',
      left: '8%',
      top: '15%',
      style: { text: 'Alaska', fontSize: 11, fill: MAP_LABEL_COLOR }
    },
    {
      type: 'text',
      left: '18%',
      bottom: '18%',
      style: { text: 'Hawaii', fontSize: 11, fill: MAP_LABEL_COLOR }
    },
    {
      type: 'text',
      right: '45%',
      top: '25%',
      style: { text: 'Continental USA', fontSize: 11, fill: MAP_LABEL_COLOR }
    },
    {
      type: 'text',
      left: '75%',
      bottom: '5%',
      style: { text: 'Puerto Rico', fontSize: 11, fill: MAP_LABEL_COLOR }
    }
  ],
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const value = params.value || 0
      return `${params.name}: ${value.toLocaleString()} dogs`
    }
  },
  visualMap: {
    min: 0,
    max: Math.max(...Object.values(byState), 1),
    left: 'left',
    bottom: '10%',
    text: ['High', 'Low'],
    inRange: {
      color: MAP_COLOR_RANGE
    }
  },
  series: [
    {
      type: 'map',
      map: 'USA',
      data,
      nameProperty: 'name',
      zoom: 1.3,
      center: [-105, 40],
      selectedMode: false,
      emphasis: {
        label: { show: false },
        itemStyle: { areaColor: MAP_EMPHASIS_COLOR }
      }
    }
  ]
})

/**
 * Handles a map click event — opens the state modal.
 *
 * @param {object} params - ECharts click event parameters.
 * @returns {Promise<void>}
 */
const handleMapClick = async (params) => {
  if (!params.name) return
  const stateCode = findStateCode(params.name)
  if (!stateCode) return
  try {
    await renderStateModal(params.name, stateCode)
  } catch {
    // errors are silently ignored — map interaction is non-critical
  }
}

/**
 * Renders a choropleth map of dog distribution across US states.
 * Errors are propagated to the caller for centralized handling.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} byState - State data object with state codes as keys and counts as values.
 * @returns {Promise<void>}
 */
export const renderDogMap = async (container, byState) => {
  const geoJson = await loadGeoJson()

  echarts.registerMap('USA', geoJson)
  echarts.getInstanceByDom(container)?.dispose()

  const chart = echarts.init(container)
  const data = buildMapData(byState)

  chart.setOption(buildMapOption(data, byState))
  chart.on('click', handleMapClick)
}
