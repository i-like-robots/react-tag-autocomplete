import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { matchSorter } from 'match-sorter'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { Harness, MockedOnInput } from './Harness'
import { suggestions } from '../../example/src/countries'
import type { MockedOnAddition, MockedOnDelete } from './Harness'
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

    it('calls the onDelete() callback with selected tag index when clicked', () => {
      userEvent.click(harness.selectedTags[0])
      expect(harness.props.onDelete).toHaveBeenCalledWith(0)

      userEvent.click(harness.selectedTags[1])
      expect(harness.props.onDelete).toHaveBeenCalledWith(1)
    })

    it('moves cursor focus to the root element after removing a tag with focus', () => {
      harness.selectedTags[0].focus()

      harness.props.selected = harness.props.selected.slice(1)
      harness.result.rerender(harness.component)

      expect(document.activeElement).toBe(harness.root)
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

    it('allows inputting a value', () => {
      userEvent.type(harness.input, 'United')
      expect(harness.input.value).toBe('United')
    })

    it('sets the input to expanded state when the list box is rendered', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-expanded')).toBe('true')

      harness.listBoxCollapse()
      expect(harness.input.getAttribute('aria-expanded')).toBe('false')
    })

    it('associates the input with the list box when it is rendered', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-owns')).toBe(harness.listBox.id)

      harness.listBoxCollapse()
      expect(harness.input.getAttribute('aria-owns')).toBeNull()
    })

    it('associates the input with the active list box option', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('')

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('react-tags-option-0')

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('react-tags-option-1')
    })

    it('calls the addition callback when an unselected option is active and enter key is pressed', () => {
      userEvent.type(harness.input, 'aus{arrowdown}{enter}')

      expect(harness.props.onAddition).toHaveBeenCalledWith({
        value: 10,
        label: 'Australia',
      })
    })

    it('calls the delete callback when a selected option is active and enter key is pressed', () => {
      harness.props.selected = [{ ...suggestions[10] }]
      harness.result.rerender(harness.component)

      userEvent.type(harness.input, 'aus')
      userEvent.type(harness.input, '{arrowdown}{enter}')

      expect(harness.props.onDelete).toHaveBeenCalledWith(0)
    })

    it('does not call any callbacks when the active option is disabled and enter key is pressed', () => {
      harness.props.suggestions = suggestions.map((item) => ({ ...item, disabled: true }))
      harness.result.rerender(harness.component)

      userEvent.type(harness.input, 'aus')
      userEvent.type(harness.input, '{arrowdown}{enter}')

      expect(harness.props.onAddition).not.toHaveBeenCalled()
    })

    it('calls the addition callback when the input value matches an option and enter key is pressed', () => {
      userEvent.type(harness.input, 'france{enter}')

      expect(harness.props.onAddition).toHaveBeenCalledWith({
        value: 63,
        label: 'France',
      })
    })

    it('clears the value when an option is selected and addition callback returns true', () => {
      userEvent.type(harness.input, 'france{enter}')
      expect(harness.input.value).toBe('')
    })

    it('does not clear the value when an option is selected and addition callback returns false', () => {
      const callback = harness.props.onAddition as MockedOnAddition

      callback.mockReturnValue(false)

      userEvent.type(harness.input, 'france{enter}')
      expect(harness.input.value).toBe('france')
    })

    it('calls the delete callback when the backspace key is pressed whilst empty', () => {
      const callback = harness.props.onDelete as MockedOnDelete

      userEvent.type(harness.input, '{backspace}')
      expect(callback).not.toHaveBeenCalled()

      harness.props.selected = [{ ...suggestions[10] }]
      harness.result.rerender(harness.component)

      userEvent.type(harness.input, '{backspace}')
      expect(callback).toHaveBeenCalledWith(0)
    })

    it('calls the input callback on each change', () => {
      const callback = harness.props.onInput as MockedOnInput

      userEvent.type(harness.input, '{esc}{arrowup}{arrowdown}')
      expect(callback).not.toHaveBeenCalled()

      userEvent.type(harness.input, 'fra')
      expect(callback).toHaveBeenNthCalledWith(1, 'f')
      expect(callback).toHaveBeenNthCalledWith(2, 'fr')
      expect(callback).toHaveBeenNthCalledWith(3, 'fra')
    })

    it('collapses the listbox when the escape key is pressed', () => {
      fireEvent.focus(harness.input)
      expect(harness.input.getAttribute('aria-expanded')).toBe('true')

      userEvent.type(harness.input, '{esc}')
      expect(harness.input.getAttribute('aria-expanded')).toBe('false')
    })

    it('expands the list box when the cursor is at the start and up key is pressed', () => {
      userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      userEvent.type(harness.input, '{esc}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(0, 0)

      userEvent.type(harness.input, '{arrowup}', {
        initialSelectionStart: 0,
        initialSelectionEnd: 0,
        skipClick: true,
      })
      expect(harness.isExpanded()).toBe(true)
    })

    it('expands the list box when the cursor is at the end and down key is pressed', () => {
      userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      userEvent.type(harness.input, '{esc}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.isExpanded()).toBe(true)
    })

    it('does not expand the list box when text is selected and up/down key is pressed', () => {
      userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      userEvent.type(harness.input, '{esc}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(0, 3)

      userEvent.type(harness.input, '{arrowup}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)
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

    it('copies the input value when there is a value', () => {
      userEvent.type(harness.input, 'aus')
      expect(harness.sizer.textContent).toBe(harness.input.value)
    })

    it('sets the input width', () => {
      userEvent.type(harness.input, 'aus')
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

    it('filters suggestions to those that match the input value', () => {
      userEvent.type(harness.input, 'uni')

      const options = screen.queryAllByRole('option')

      expect(options.length).toBe(5)

      options.forEach((option) => {
        expect(option.textContent).toMatch(/uni/i)
      })
    })

    it('highlights the text matching the input value in each option', () => {
      userEvent.type(harness.input, 'uni')

      const options = screen.queryAllByRole('option')

      options.forEach((option) => {
        expect(option.innerHTML).toMatch(/<mark>uni<\/mark>/i)
      })
    })

    it('allows the active option to wrap', () => {
      userEvent.type(harness.input, 'aus')

      const [option1, option2] = harness.options

      expect(harness.activeOption).toBeNull()

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.activeOption).toBe(option1)

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.activeOption).toBe(option2)

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.activeOption).toBeNull()

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.activeOption).toBe(option1)
    })

    it('maintains the active option when still available after typing', () => {
      userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      userEvent.type(harness.input, 'n')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      userEvent.type(harness.input, '{backspace}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')
    })

    it('resets the active option when no longer available after typing', () => {
      userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      userEvent.type(harness.input, 'b')
      expect(harness.activeOption).toBeNull()
    })

    it('sets the active option on mousedown', () => {
      userEvent.type(harness.input, 'aus')
      expect(harness.activeOption).toBeNull()

      fireEvent.mouseDown(harness.options[0])
      expect(harness.activeOption).toBe(harness.options[0])
    })

    it('calls the addition callback when an unselected option is clicked', () => {
      userEvent.type(harness.input, 'aus')
      userEvent.click(harness.options[0])

      expect(harness.props.onAddition).toHaveBeenCalledWith({
        value: 10,
        label: 'Australia',
      })
    })

    it('calls the delete callback when a selected option is clicked', () => {
      harness.props.selected = [{ ...suggestions[10] }]
      harness.result.rerender(harness.component)

      harness.listBoxExpand()

      userEvent.click(harness.options[10])
      expect(harness.props.onDelete).toHaveBeenCalledWith(0)
    })

    it('ignores clicks on disabled options', () => {
      harness.props.suggestions = suggestions.map((item) => ({ ...item, disabled: true }))
      harness.result.rerender(harness.component)

      harness.listBoxExpand()

      userEvent.click(harness.options[10])
      expect(harness.props.onAddition).not.toHaveBeenCalled()
    })

    it('always moves the cursor focus back to the input', () => {
      userEvent.type(harness.input, 'aus')
      userEvent.click(harness.options[0])

      expect(document.activeElement).toBe(harness.input)
    })

    it('remains open when an option is selected and closeOnSelect is disabled', () => {
      userEvent.type(harness.input, 'aus')
      userEvent.click(harness.options[0])

      expect(harness.isExpanded()).toBe(true)
    })

    it('closes when an option is selected and closeOnSelect is enabled', () => {
      harness.props.closeOnSelect = true
      harness.result.rerender(harness.component)

      userEvent.type(harness.input, 'aus')
      userEvent.click(harness.options[0])

      expect(harness.isExpanded()).toBe(false)
    })

    it('maintains the active option after options are selected/deleted', () => {
      userEvent.type(harness.input, 'bahrain{arrowdown}')
      expect(harness.options.length).toBe(1)
      expect(harness.activeOption.textContent).toBe('Bahrain')

      userEvent.click(harness.activeOption)
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
      harness.props.selected = [...harness.props.selected, { ...suggestions[11] }]
      harness.result.rerender(harness.component)

      expect(harness.announcements.textContent).toBe('Selected tag Austria')
    })

    it('appends a removal message when selected tags are removed', () => {
      harness.props.selected = []
      harness.result.rerender(harness.component)

      expect(harness.announcements.textContent).toBe('Removed tag Australia')
    })
  })

  describe('without suggestions', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions: [] })
    })

    it('shows no suggestions message when there are no options to show', () => {
      userEvent.type(harness.input, 'blah')
      expect(screen.queryByText('No options found')).toBeTruthy()
    })

    it('does not respond to arrow up/down key presses', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('')

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('')
    })

    it('does not respond to enter key presses', () => {
      userEvent.type(harness.input, '{enter}')
      expect(harness.props.onAddition).not.toHaveBeenCalledWith()
      expect(harness.props.onDelete).not.toHaveBeenCalledWith()
    })
  })

  describe('when given new suggestions', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions })
    })

    it('maintains the active option when still available', () => {
      userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      harness.props.suggestions = [...suggestions].reverse()
      harness.result.rerender(harness.component)

      expect(harness.activeOption.textContent).toBe('British Virgin Islands')
    })

    it('resets the active option when no longer available', () => {
      userEvent.type(harness.input, 'gi{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('British Virgin Islands')

      harness.props.suggestions = [...suggestions].filter(
        (tag) => tag.label !== 'British Virgin Islands'
      )
      harness.result.rerender(harness.component)

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

    it('ignores clicking on the selected tags', () => {
      userEvent.click(harness.selectedTags[0])
      expect(harness.props.onDelete).not.toHaveBeenCalled()
    })

    it('sets the disabled state on the input', () => {
      expect(harness.input.getAttribute('aria-disabled')).toBe('true')
    })

    it('ignores inputting a value', () => {
      userEvent.type(harness.input, 'uni')
      expect(harness.input.value).toBe('')
    })
  })

  describe('when invalid', () => {
    beforeEach(() => {
      harness = new Harness({ isInvalid: true })
    })

    it('sets the invalid state on the root', () => {
      expect(harness.root.classList.contains('is-invalid')).toBe(true)
    })

    it('sets the invalid state on the input', () => {
      expect(harness.input.getAttribute('aria-invalid')).toBe('true')
    })
  })

  // describe('when deleting tags with backspace is disabled', () => {})

  describe('when new tags can be created', () => {
    beforeEach(() => {
      harness = new Harness({ allowNew: true })
    })

    it('displays the new tag option', () => {
      userEvent.type(harness.input, 'blah')
      expect(screen.queryByText('Add blah'))
    })

    it('allows non-suggested options to be added when new tag option is active', () => {
      userEvent.type(harness.input, 'boop{enter}')
      expect(harness.props.onAddition).not.toHaveBeenCalled()

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.activeOption.textContent).toBe('Add boop')

      userEvent.type(harness.input, '{enter}')
      expect(harness.props.onAddition).toHaveBeenCalledWith({ label: 'boop', value: null })
    })
  })

  describe('with custom suggestions transform', () => {
    beforeEach(() => {
      const suggestionsTransform: SuggestionsTransform = (query, suggestions) => {
        return matchSorter(suggestions, query, { keys: ['label'] })
      }

      harness = new Harness({ suggestions, suggestionsTransform })
    })

    it('uses provided suggestionsTransform callback', () => {
      userEvent.type(harness.input, 'uni')

      const [one, two, ...others] = harness.options

      expect(one.textContent).toBe('United Arab Emirates') // top match
      expect(two.textContent).toBe('United Kingdom')
      expect(others.some((option) => option.textContent === 'Reunion')).toBe(true)
      expect(others.some((option) => option.textContent === 'Tunisia')).toBe(true)
    })
  })
})
