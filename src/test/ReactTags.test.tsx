import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { matchSorter } from 'match-sorter'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { Harness, MockedOnAdd } from './Harness'
import { suggestions } from '../../example/src/countries'
import type { MockedOnDelete, MockedOnInput, MockedOnValidate } from './Harness'
import type { SuggestionsTransform } from '../sharedTypes'

describe('React Tags Autocomplete', () => {
  let harness: Harness

  afterEach(() => {
    cleanup()
  })

  describe('root', () => {
    beforeEach(() => {
      harness = new Harness()
    })

    it('associates the root with a descriptive label', () => {
      expect(harness.root.getAttribute('aria-describedby')).toBe('react-tags-label')
    })

    it('sets active state when document focus is inside', () => {
      fireEvent.focus(harness.input)
      expect(harness.root.classList.contains('is-active')).toBe(true)

      fireEvent.blur(harness.input)
      expect(harness.root.classList.contains('is-active')).toBe(false)
    })
  })

  describe('label', () => {
    beforeEach(() => {
      harness = new Harness()
    })

    it('renders a label with ID', () => {
      expect(harness.label.id).toBe('react-tags-label')
    })
  })

  describe('selected tags list', () => {
    const tags = [{ ...suggestions[0] }, { ...suggestions[1] }]

    beforeEach(() => {
      harness = new Harness({ suggestions, selected: tags })
    })

    it('assigns the selected tag list a label', () => {
      expect(screen.queryByLabelText('Selected tags')).toBe(harness.selectedList)
    })

    it('renders each selected tag', () => {
      expect(harness.selectedTags.length).toBe(tags.length)
    })

    it('calls the onDelete() callback with selected tag index when clicked', async () => {
      await userEvent.click(harness.selectedTags[0])
      expect(harness.props.onDelete).toHaveBeenCalledWith(0)

      await userEvent.click(harness.selectedTags[1])
      expect(harness.props.onDelete).toHaveBeenCalledWith(1)
    })

    it('moves cursor focus to the root element after removing a tag with focus', () => {
      harness.selectedTags[0].focus()

      harness.rerender({ selected: harness.props.selected.slice(1) })

      expect(document.activeElement).toBe(harness.input)
    })
  })

  describe('input', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions })
    })

    it('assigns the label text', () => {
      expect(screen.queryByLabelText('Select tags')).toBe(harness.input)
    })

    it('assigns the placeholder text', () => {
      expect(screen.getByPlaceholderText('Add a tag')).toBe(harness.input)
    })

    it('assigns the combobox role', () => {
      expect(screen.getByRole('combobox')).toBe(harness.input)
    })

    it('disables browser/OS/extension autocomplete', () => {
      expect(harness.input.getAttribute('autocomplete')).toBe('off')
      expect(harness.input.getAttribute('data-form-type')).toBe('other')
    })

    it('allows inputting a value', async () => {
      await userEvent.type(harness.input, 'United')
      expect(harness.input.value).toBe('United')
    })

    it('sets the input to expanded state when the list box is rendered', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-expanded')).toBe('true')

      harness.listBoxCollapse()
      expect(harness.input.getAttribute('aria-expanded')).toBe('false')
    })

    it('associates the input with the list box', () => {
      expect(harness.input.getAttribute('aria-owns')).toBe('react-tags-listbox')
    })

    it('associates the input with the active list box option', async () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-activedescendant')).toBeNull()

      await userEvent.type(harness.input, '{arrowdown}')
      expect(harness.input.getAttribute('aria-activedescendant')).toMatch(/react-tags-option-0-/)

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.input.getAttribute('aria-activedescendant')).toMatch(/react-tags-option-1-/)
    })

    it('allows skipping to first and last options with page up and down keys', async () => {
      await userEvent.type(harness.input, 'au{arrowdown}{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('Guinea Bissau')

      await userEvent.type(harness.input, '{pagedown}', { skipClick: true })
      expect(harness.activeOption.textContent).toBe('Saudi Arabia')

      await userEvent.type(harness.input, '{pageup}', { skipClick: true })
      expect(harness.activeOption.textContent).toBe('Australia')
    })

    it('calls the addition callback when an unselected option is active and enter key is pressed', async () => {
      await userEvent.type(harness.input, 'aus{arrowdown}{enter}')

      expect(harness.props.onAdd).toHaveBeenCalledWith({
        value: 10,
        label: 'Australia',
      })
    })

    it('calls the delete callback when a selected option is active and enter key is pressed', async () => {
      harness.rerender({ selected: [{ ...suggestions[10] }] })

      await userEvent.type(harness.input, 'aus{arrowdown}{enter}')

      expect(harness.props.onDelete).toHaveBeenCalledWith(0)
    })

    it('does not call any callbacks when the active option is disabled and enter key is pressed', async () => {
      const newSuggestions = suggestions.map((item) => ({ ...item, disabled: true }))
      harness.rerender({ suggestions: newSuggestions })

      await userEvent.type(harness.input, 'aus{arrowdown}{enter}')
      expect(harness.props.onAdd).not.toHaveBeenCalled()
    })

    it('calls the addition callback when the input value matches an option and enter key is pressed', async () => {
      await userEvent.type(harness.input, 'france{enter}')

      expect(harness.props.onAdd).toHaveBeenCalledWith({
        value: 63,
        label: 'France',
      })
    })

    it('triggers tag selection when the tab is pressed and allowTab is true', async () => {
      harness.rerender({ allowTab: true })

      await userEvent.type(harness.input, 'aus{arrowdown}{Tab}')

      expect(harness.props.onAdd).toHaveBeenCalledWith({
        value: 10,
        label: 'Australia',
      })
    })

    it('clears the value after an option is selected', async () => {
      await userEvent.type(harness.input, 'france{enter}')
      expect(harness.input.value).toBe('')
    })

    it('calls the delete callback when backspace is pressed whilst empty and allowBackspace is true', async () => {
      const callback = harness.props.onDelete as MockedOnDelete

      await userEvent.type(harness.input, '{backspace}')
      expect(callback).not.toHaveBeenCalled()

      harness.rerender({ selected: [{ ...suggestions[10] }] })

      await userEvent.type(harness.input, '{backspace}', { skipClick: true })
      expect(callback).toHaveBeenCalledWith(0)
    })

    it('does not call the delete callback when backspace is pressed whilst empty and allowBackspace is false', async () => {
      const callback = harness.props.onDelete as MockedOnDelete

      harness.rerender({ allowBackspace: false, selected: [{ ...suggestions[10] }] })

      await userEvent.type(harness.input, '{backspace}')
      expect(callback).not.toHaveBeenCalled()
    })

    it('calls the input callback on each change', async () => {
      const callback = harness.props.onInput as MockedOnInput

      await userEvent.type(harness.input, '{Escape}{arrowup}{arrowdown}')
      expect(callback).not.toHaveBeenCalled()

      await userEvent.type(harness.input, 'fra', { skipClick: true })
      expect(callback).toHaveBeenNthCalledWith(1, 'f')
      expect(callback).toHaveBeenNthCalledWith(2, 'fr')
      expect(callback).toHaveBeenNthCalledWith(3, 'fra')
    })

    it('collapses the listbox if open when the escape key is pressed', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)
    })

    it('clears the input value when the listbox is closed when the escape key is pressed', async () => {
      await userEvent.type(harness.input, 'uni{Escape}')
      expect(harness.input.value).toBe('uni')

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.input.value).toBe('')
    })

    it('expands the listbox on change', async () => {
      await userEvent.type(harness.input, '{Escape}')
      expect(harness.isExpanded()).toBe(false)

      await userEvent.type(harness.input, 'uni', { skipClick: true })
      expect(harness.isExpanded()).toBe(true)
    })

    it('expands the listbox when the input is clicked', async () => {
      await userEvent.type(harness.input, '{Escape}')
      expect(harness.isExpanded()).toBe(false)

      fireEvent.click(harness.input)
      expect(harness.isExpanded()).toBe(true)
    })

    it('expands the list box when the cursor is at the start and up key is pressed', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(0, 0)

      await userEvent.type(harness.input, '{arrowup}', {
        initialSelectionStart: 0,
        initialSelectionEnd: 0,
        skipClick: true,
      })

      expect(harness.isExpanded()).toBe(true)
    })

    it('expands the list box when the cursor is at the end and down key is pressed', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.isExpanded()).toBe(true)
    })

    it('does not expand the list box when text is selected and up/down key is pressed', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(0, 3)

      await userEvent.type(harness.input, '{arrowup}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)
    })

    it('does nothing when the enter key is pressed and the listbox is closed', async () => {
      await userEvent.type(harness.input, 'uni{arrowdown}{Escape}{enter}')

      expect(harness.isExpanded()).toBe(false)
      expect(harness.props.onAdd as MockedOnAdd).not.toHaveBeenCalled()
      expect(harness.props.onDelete as MockedOnDelete).not.toHaveBeenCalled()
    })

    it('does nothing when the tab key is pressed and the listbox is closed', async () => {
      harness.rerender({ allowTab: true })

      await userEvent.type(harness.input, 'uni{arrowdown}{Escape}{Tab}')

      expect(harness.isExpanded()).toBe(false)
      expect(harness.props.onAdd as MockedOnAdd).not.toHaveBeenCalled()
      expect(harness.props.onDelete as MockedOnDelete).not.toHaveBeenCalled()
    })
  })

  describe('sizer', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions })
    })

    it('removes the sizer from the layout', () => {
      const result = Array.from(harness.sizer.style)
      expect(result).toEqual(expect.arrayContaining(['position', 'visibility']))
    })

    it('copies styles from the input', () => {
      const result = Array.from(harness.sizer.style)
      expect(result).toEqual(expect.arrayContaining(['font-family', 'letter-spacing']))
    })

    it('copies the input placeholder when there is no value', () => {
      expect(harness.sizer.textContent).toBe(harness.input.placeholder)
    })

    it('copies the input placeholder when longer than the value', async () => {
      await userEvent.type(harness.input, 'aus')
      expect(harness.sizer.textContent).toBe(harness.input.placeholder)
    })

    it('copies the input value when longer than the placeholder', async () => {
      await userEvent.type(harness.input, 'antigua & barbuda')
      expect(harness.sizer.textContent).toBe(harness.input.value)
    })

    it('sets the input width', async () => {
      await userEvent.type(harness.input, 'aus')
      expect(harness.input.style.width).toMatch(/^[0-9]+px$/)
    })
  })

  describe('listbox', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions })
    })

    it('renders the list box on input focus', () => {
      harness.listBoxExpand()
      expect(screen.queryByRole('listbox')).toBe(harness.listBox)

      harness.listBoxCollapse()
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('renders each suggestion as an option in the list box', () => {
      harness.listBoxExpand()
      expect(screen.queryAllByRole('option').length).toBe(suggestions.length)
    })

    it('filters suggestions to those that match the input value', async () => {
      await userEvent.type(harness.input, 'uni')

      const options = screen.queryAllByRole('option')

      expect(options.length).toBe(5)

      options.forEach((option) => {
        expect(option.textContent).toMatch(/uni/i)
      })
    })

    it('highlights the text matching the input value in each option', async () => {
      await userEvent.type(harness.input, 'uni')

      const options = screen.queryAllByRole('option')

      options.forEach((option) => {
        expect(option.innerHTML).toMatch(/<mark>uni<\/mark>/i)
      })
    })

    it('allows the active option to wrap', async () => {
      await userEvent.type(harness.input, 'aus')

      const [option1, option2] = harness.options

      expect(harness.activeOption).toBeNull()

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.activeOption).toBe(option1)

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.activeOption).toBe(option2)

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.activeOption).toBeNull()

      await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.activeOption).toBe(option1)
    })

    it('maintains the active option when still available after typing', async () => {
      await userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      await userEvent.type(harness.input, 'n', { skipClick: true })
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      await userEvent.type(harness.input, '{backspace}', { skipClick: true })
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')
    })

    it('resets the active option when no longer available after typing', async () => {
      await userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      await userEvent.type(harness.input, 'b', { skipClick: true })
      expect(harness.activeOption).toBeNull()
    })

    it('sets the active option on mousedown', async () => {
      await userEvent.type(harness.input, 'aus')
      expect(harness.activeOption).toBeNull()

      fireEvent.mouseDown(harness.options[0])
      expect(harness.activeOption).toBe(harness.options[0])
    })

    it('resets the active option when collapsed', async () => {
      await userEvent.type(harness.input, 'aus{arrowdown}')
      expect(harness.activeOption.textContent).toBe('Australia')

      await userEvent.type(harness.input, '{Escape}{arrowdown}', { skipClick: true })
      expect(harness.activeOption).toBeNull()
    })

    it('calls the addition callback when an unselected option is clicked', async () => {
      await userEvent.type(harness.input, 'aus')
      await userEvent.click(harness.options[0])

      expect(harness.props.onAdd).toHaveBeenCalledWith({
        value: 10,
        label: 'Australia',
      })
    })

    it('calls the delete callback when a selected option is clicked', async () => {
      harness.rerender({ selected: [{ ...suggestions[10] }] })

      harness.listBoxExpand()

      await userEvent.click(harness.options[10])
      expect(harness.props.onDelete).toHaveBeenCalledWith(0)
    })

    it('ignores clicks on disabled options', async () => {
      const newSuggestions = suggestions.map((item) => ({ ...item, disabled: true }))
      harness.rerender({ suggestions: newSuggestions })

      harness.listBoxExpand()

      await userEvent.click(harness.options[10])
      expect(harness.props.onAdd).not.toHaveBeenCalled()
    })

    it('always moves the cursor focus back to the input', async () => {
      await userEvent.type(harness.input, 'aus')
      await userEvent.click(harness.options[0])

      expect(document.activeElement).toBe(harness.input)
    })

    it('remains open when an option is selected and closeOnSelect is disabled', async () => {
      await userEvent.type(harness.input, 'aus')
      await userEvent.click(harness.options[0])

      expect(harness.isExpanded()).toBe(true)
    })

    it('closes when an option is selected and closeOnSelect is enabled', async () => {
      harness.rerender({ closeOnSelect: true })

      await userEvent.type(harness.input, 'aus')
      await userEvent.click(harness.options[0])

      expect(harness.isExpanded()).toBe(false)
    })

    it('maintains the active option after options are selected/deleted', async () => {
      await userEvent.type(harness.input, 'bahrain{arrowdown}')
      expect(harness.options.length).toBe(1)
      expect(harness.activeOption.textContent).toBe('Bahrain')

      await userEvent.click(harness.activeOption)
      expect(harness.options.length).toBe(206)
      expect(harness.activeOption.textContent).toBe('Bahrain')
    })
  })

  describe('announcements', () => {
    beforeEach(() => {
      harness = new Harness({ selected: [{ ...suggestions[10] }] })
    })

    it('renders a status box', () => {
      expect(screen.queryByRole('status')).toBe(harness.announcements)
    })

    it('removes the status box from the layout', () => {
      const result = Array.from(harness.announcements.style)
      expect(result).toEqual(expect.arrayContaining(['position', 'left']))
    })

    it('does not output any messages on first render', () => {
      expect(harness.announcements.textContent).toBe('')
    })

    it('appends an addition message when new tags are added', () => {
      const selected = [...harness.props.selected, { ...suggestions[11] }]
      harness.rerender({ selected })

      expect(harness.announcements.textContent).toBe('Added tag Austria')
    })

    it('appends a removal message when selected tags are removed', () => {
      harness.rerender({ selected: [] })

      expect(harness.announcements.textContent).toBe('Removed tag Australia')
    })
  })

  describe('without suggestions', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions: [] })
    })

    it('shows no suggestions message', async () => {
      await userEvent.type(harness.input, 'blah')
      expect(screen.queryByText('No options found for blah')).toBeTruthy()
    })

    it('does not highlight the no suggestions text', async () => {
      await userEvent.type(harness.input, 'blah')
      const [option] = screen.queryAllByRole('option')
      expect(option.innerHTML).not.toMatch(/<mark>/)
    })

    it('does not respond to arrow up/down key presses', async () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-activedescendant')).toBeNull()

      await userEvent.type(harness.input, '{arrowdown}')
      expect(harness.input.getAttribute('aria-activedescendant')).toBeNull()
    })

    it('does not respond to enter key presses', async () => {
      await userEvent.type(harness.input, '{enter}')
      expect(harness.props.onAdd).not.toHaveBeenCalledWith()
      expect(harness.props.onDelete).not.toHaveBeenCalledWith()
    })
  })

  describe('when given new suggestions', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions })
    })

    it('maintains the active option when still available', async () => {
      await userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      harness.rerender({ suggestions: [...suggestions].reverse() })

      expect(harness.activeOption.textContent).toBe('British Virgin Islands')
    })

    it('resets the active option when no longer available', async () => {
      await userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      const newSuggestions = [...suggestions].filter(
        (tag) => tag.label !== 'British Virgin Islands'
      )
      harness.rerender({ suggestions: newSuggestions })

      expect(harness.activeOption).toBeNull()
    })
  })

  describe('when disabled', () => {
    beforeEach(() => {
      harness = new Harness({ isDisabled: true, selected: [{ ...suggestions[10] }] })
    })

    it('sets the disabled state on the root', () => {
      expect(harness.root.classList.contains('is-disabled')).toBe(true)
    })

    it('sets the disabled state on the selected tags', () => {
      expect(harness.selectedTags[0].getAttribute('aria-disabled')).toBe('true')
    })

    it('ignores clicking on the selected tags', async () => {
      await userEvent.click(harness.selectedTags[0])
      expect(harness.props.onDelete).not.toHaveBeenCalled()
    })

    it('sets the disabled state on the input', () => {
      expect(harness.input.getAttribute('aria-disabled')).toBe('true')
    })

    it('ignores inputting a value', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.input.value).toBe('')
    })
  })

  describe('when invalid', () => {
    beforeEach(() => {
      harness = new Harness({ isInvalid: true, ariaErrorMessage: 'id' })
    })

    it('sets the invalid state on the root', () => {
      expect(harness.root.classList.contains('is-invalid')).toBe(true)
    })

    it('sets the invalid state on the input', () => {
      expect(harness.input.getAttribute('aria-invalid')).toBe('true')
    })

    it('renders the error message attribute if provided', () => {
      expect(harness.input.getAttribute('aria-errormessage')).toBe('id')
    })
  })

  describe('when new tags can be created', () => {
    beforeEach(() => {
      harness = new Harness({ allowNew: true })
    })

    it('displays the new tag option', async () => {
      await userEvent.type(harness.input, 'blah')
      expect(screen.queryByText('Add blah'))
    })

    it('does not highlight the new tag option text', async () => {
      await userEvent.type(harness.input, 'uni')
      const [option] = screen.queryAllByRole('option')
      expect(option.innerHTML).not.toMatch(/<mark>/)
    })

    it('calls the onValidate callback when the value changes', async () => {
      await userEvent.type(harness.input, 'uni')

      expect(harness.props.onValidate).toHaveBeenCalledWith('u')
      expect(harness.props.onValidate).toHaveBeenCalledWith('un')
      expect(harness.props.onValidate).toHaveBeenCalledWith('uni')
    })

    it('disables the new tag option when onValidate returns false', async () => {
      const callback = harness.props.onValidate as MockedOnValidate
      callback.mockReturnValue(false)

      await userEvent.type(harness.input, 'uni')

      const [option] = screen.queryAllByRole('option')
      expect(option.getAttribute('aria-disabled')).toBe('true')
    })

    it('calls onAdd with new tag when selected', async () => {
      await userEvent.type(harness.input, 'boop{enter}')
      expect(harness.props.onAdd).not.toHaveBeenCalled()

      await userEvent.type(harness.input, '{arrowdown}{enter}', { skipClick: true })
      expect(harness.props.onAdd).toHaveBeenCalledWith({ label: 'boop', value: null })
    })

    it('does not call the onAdd with new tag when selected and onValidate returns false', async () => {
      const callback = harness.props.onValidate as MockedOnValidate
      callback.mockReturnValue(false)

      await userEvent.type(harness.input, 'boop{enter}')
      expect(harness.props.onAdd).not.toHaveBeenCalled()

      await userEvent.type(harness.input, '{arrowdown}{enter}', { skipClick: true })
      expect(harness.props.onAdd).not.toHaveBeenCalled()
    })
  })

  describe('with custom suggestions transform', () => {
    beforeEach(() => {
      const suggestionsTransform: SuggestionsTransform = (query, suggestions) => {
        return matchSorter(suggestions, query, { keys: ['label'] })
      }

      harness = new Harness({ suggestions, suggestionsTransform })
    })

    it('uses provided suggestionsTransform callback', async () => {
      await userEvent.type(harness.input, 'uni')

      const [one, two, ...others] = harness.options

      expect(one.textContent).toBe('United Arab Emirates') // top match
      expect(two.textContent).toBe('United Kingdom')
      expect(others.some((option) => option.textContent === 'Reunion')).toBe(true)
      expect(others.some((option) => option.textContent === 'Tunisia')).toBe(true)
    })
  })
})
