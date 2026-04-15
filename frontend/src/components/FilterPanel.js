/**
 * @file Filter panel component for filtering the dog list.
 * @module src/components/FilterPanel.js
 * @author Hanna Rubio Vretby <hr222sy@student.lnu.se>
 * @version 1.0.0
 */

import { setState } from '../state.js'

/**
 * Dropdown filter configurations.
 * @type {Array<{label: string, parameterKey: string, options: Array<{label: string, value: string}>}>}
 */
const DROPDOWN_FILTERS = [
  {
    label: 'Location',
    parameterKey: 'location',
    options: [
      { label: 'All', value: '' },
      { label: 'Continental USA', value: 'continental' },
      { label: 'Hawaii', value: 'hawaii' },
      { label: 'Alaska', value: 'alaska' },
      { label: 'Puerto Rico', value: 'puerto_rico' }
    ]
  },
  {
    label: 'Age',
    parameterKey: 'age',
    options: [
      { label: 'All', value: '' },
      { label: 'Baby', value: 'Baby' },
      { label: 'Young', value: 'Young' },
      { label: 'Adult', value: 'Adult' },
      { label: 'Senior', value: 'Senior' }
    ]
  },
  {
    label: 'Size',
    parameterKey: 'size',
    options: [
      { label: 'All', value: '' },
      { label: 'Small', value: 'Small' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Large', value: 'Large' },
      { label: 'Extra Large', value: 'Extra Large' }
    ]
  },
  {
    label: 'Sex',
    parameterKey: 'sex',
    options: [
      { label: 'All', value: '' },
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' }
    ]
  }
]

/**
 * Checkbox filter configurations.
 * @type {Array<{label: string, parameterKey: string}>}
 */
const CHECKBOX_FILTERS = [
  { label: 'Good with Children', parameterKey: 'envChildren' },
  { label: 'Good with Dogs', parameterKey: 'envDogs' },
  { label: 'Good with Cats', parameterKey: 'envCats' },
  { label: 'House Trained', parameterKey: 'houseTrained' }
]

/**
 * Creates a dropdown filter element.
 *
 * @param {string} label - Dropdown label.
 * @param {Array<{label: string, value: string}>} options - Dropdown options.
 * @param {Function} onSelectionChange - Callback when selection changes.
 * @returns {HTMLElement} Dropdown wrapper element.
 */
const createDropdownFilter = (label, options, onSelectionChange) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'flex flex-col gap-1'

  const labelElement = document.createElement('label')
  labelElement.className = 'text-xs text-gray-500 uppercase tracking-wide'
  labelElement.textContent = label

  const select = document.createElement('select')
  select.className = 'border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer'

  options.forEach(({ label: optionLabel, value }) => {
    const optionElement = document.createElement('option')
    optionElement.value = value
    optionElement.textContent = optionLabel
    select.append(optionElement)
  })

  select.addEventListener('change', () => onSelectionChange(select.value))

  wrapper.append(labelElement, select)
  return wrapper
}

/**
 * Creates a checkbox filter element.
 *
 * @param {string} label - Checkbox label.
 * @param {Function} onSelectionChange - Callback when checkbox changes.
 * @returns {HTMLElement} Checkbox wrapper element.
 */
const createCheckboxFilter = (label, onSelectionChange) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'flex items-center gap-2'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer'

  const labelElement = document.createElement('label')
  labelElement.className = 'text-sm text-gray-700'
  labelElement.textContent = label

  checkbox.addEventListener('change', () => onSelectionChange(checkbox.checked))

  wrapper.append(checkbox, labelElement)
  return wrapper
}

/**
 * Renders a filter panel with dropdowns and checkboxes for filtering dogs.
 * Updates global state when filters change.
 *
 * @param {HTMLElement} container - Container element.
 */
export const renderFilterPanel = (container) => {
  const activeFilters = {}

  const panel = document.createElement('div')
  panel.className = 'flex flex-wrap gap-6 items-end pb-4 mb-4 border-b border-gray-100'

  const dropdownFiltersContainer = document.createElement('div')
  dropdownFiltersContainer.className = 'flex flex-wrap gap-4 items-end'

  DROPDOWN_FILTERS.forEach(({ label, parameterKey, options }) => {
    const dropdown = createDropdownFilter(label, options, (selectedValue) => {
      if (selectedValue) {
        activeFilters[parameterKey] = selectedValue
      } else {
        delete activeFilters[parameterKey]
      }
      setState({ filters: { ...activeFilters } })
    })
    dropdownFiltersContainer.append(dropdown)
  })

  const checkboxFiltersContainer = document.createElement('div')
  checkboxFiltersContainer.className = 'flex flex-wrap gap-4 items-center'

  CHECKBOX_FILTERS.forEach(({ label, parameterKey }) => {
    const checkbox = createCheckboxFilter(label, (isChecked) => {
      if (isChecked) {
        activeFilters[parameterKey] = 'true'
      } else {
        delete activeFilters[parameterKey]
      }
      setState({ filters: { ...activeFilters } })
    })
    checkboxFiltersContainer.append(checkbox)
  })

  panel.append(dropdownFiltersContainer, checkboxFiltersContainer)
  container.append(panel)
}