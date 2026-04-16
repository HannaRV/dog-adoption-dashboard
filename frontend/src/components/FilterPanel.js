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
  wrapper.className = 'filter-dropdown-wrapper'

  const labelElement = document.createElement('label')
  labelElement.className = 'filter-label'
  labelElement.textContent = label

  const select = document.createElement('select')
  select.className = 'filter-select'

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
  wrapper.className = 'filter-checkbox-wrapper'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'filter-checkbox'

  const labelElement = document.createElement('label')
  labelElement.className = 'filter-checkbox-label'
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
  panel.className = 'filter-panel'

  const dropdownFiltersContainer = document.createElement('div')
  dropdownFiltersContainer.className = 'filter-dropdown-group'

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
  checkboxFiltersContainer.className = 'filter-checkbox-group'

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
