/**
 * @file Dog map component displaying dog distribution across US states.
 * @module src/components/DogMap.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import * as echarts from 'echarts'

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

/**
 * Renders a choropleth map of dog distribution across US states.
 *
 * @param {HTMLElement} container - Container element.
 * @param {object} byState - State data object with state codes as keys and counts as values.
 */
export const renderDogMap = async (container, byState) => {
  let geoJson

  try {
    geoJson = await fetch('/assets/geodata/us-states.json').then(r => r.json())
  } catch {
    console.error('Failed to load US GeoJSON data')
    return
  }
  
  echarts.registerMap('USA', geoJson)

  const chart = echarts.init(container)

  const data = Object.entries(byState)
    .filter(([code]) => STATE_CODES[code])
    .map(([code, value]) => ({ name: STATE_CODES[code], value }))

  const option = {
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
        style: {
          text: 'Alaska',
          fontSize: 11,
          fill: '#9ca3af'
        }
      },
      {
        type: 'text',
        left: '18%',
        bottom: '18%',
        style: {
          text: 'Hawaii',
          fontSize: 11,
          fill: '#9ca3af'
        }
      },
      {
        type: 'text',
        right: '45%',
        top: '25%',
        style: {
          text: 'Continental USA',
          fontSize: 11,
          fill: '#9ca3af'
        }
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
      max: Math.max(...Object.values(byState)),
      left: 'left',
      bottom: '10%',
      text: ['High', 'Low'],
      inRange: {
        color: ['#e0e7ff', '#4338ca']
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
        emphasis: {
          label: { show: false },
          itemStyle: { areaColor: '#818cf8' }
        }
      }
    ]
  }

  chart.setOption(option)
}
