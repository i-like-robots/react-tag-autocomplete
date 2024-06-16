import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
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

    it('calls the onFocus callback when component focus is gained', () => {
      fireEvent.focus(harness.input)
      expect(harness.props.onFocus).toHaveBeenCalledOnce()
    })

    it('calls the onBlur callback when component focus is lost', () => {
      fireEvent.blur(harness.input)
      expect(harness.props.onBlur).toHaveBeenCalledOnce()
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
      expect(harness.input.getAttribute('aria-controls')).toBe('react-tags-listbox')
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
        value: 64,
        label: 'France',
      })
    })

    it('triggers tag selection when another delimiter key is pressed', async () => {
      harness.rerender({ delimiterKeys: ['Enter', 'Tab'] })

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

    it('collapses the listbox if expanded when the escape key is pressed', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)
    })

    it('clears the input value when the listbox is collapsed when the escape key is pressed', async () => {
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

    it('expands the list box when the cursor is mid text and alt + down key is pressed', async () => {
      await userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      await userEvent.type(harness.input, '{Escape}', { skipClick: true })
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(1, 0)

      await userEvent.type(harness.input, '{Alt>}{arrowdown}{/Alt}', {
        initialSelectionStart: 1,
        initialSelectionEnd: 0,
        skipClick: true,
      })

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

    it('does nothing when the enter key is pressed and the listbox is collapsed', async () => {
      await userEvent.type(harness.input, 'uni{arrowdown}{Escape}{enter}')

      expect(harness.isExpanded()).toBe(false)
      expect(harness.props.onAdd as MockedOnAdd).not.toHaveBeenCalled()
      expect(harness.props.onDelete as MockedOnDelete).not.toHaveBeenCalled()
    })

    it('does nothing when another delimiter key is pressed and the listbox is collapsed', async () => {
      harness.rerender({ delimiterKeys: ['Enter', 'Tab'] })

      await userEvent.type(harness.input, 'uni{arrowdown}{Escape}{Tab}')

      expect(harness.isExpanded()).toBe(false)
      expect(harness.props.onAdd as MockedOnAdd).not.toHaveBeenCalled()
      expect(harness.props.onDelete as MockedOnDelete).not.toHaveBeenCalled()
    })
  })

  describe('sizer', () => {
    beforeEach(() => {
      const Styles: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
        const styles = 'input { font-family: FooBar; font-size: 12px; }'
        return (
          <div>
            <style dangerouslySetInnerHTML={{ __html: styles }}></style>
            {children}
          </div>
        )
      }

      harness = new Harness({ suggestions }, { wrapper: Styles })
    })

    it('removes the sizer from the layout', () => {
      expect(harness.sizer.style.getPropertyValue('position')).toBe('absolute')
      expect(harness.sizer.style.getPropertyValue('visibility')).toBe('hidden')
    })

    it('copies styles from the input', () => {
      expect(harness.sizer.style.getPropertyValue('font-family')).toBe('FooBar')
      expect(harness.sizer.style.getPropertyValue('font-size')).toBe('12px')
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
        expect(option.innerHTML).toMatch(/<mark class="[^"]+">uni<\/mark>/i)
      })
    })

    it('wraps the active option from first to last and vice-versa', async () => {
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

      await userEvent.type(harness.input, '{arrowup}', { skipClick: true })
      expect(harness.activeOption).toBeNull()

      await userEvent.type(harness.input, '{arrowup}', { skipClick: true })
      expect(harness.activeOption).toBe(option2)
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

    it('remains expanded when an option is selected and collapseOnSelect is disabled', async () => {
      await userEvent.type(harness.input, 'aus')
      await userEvent.click(harness.options[0])

      expect(harness.isExpanded()).toBe(true)
    })

    it('collapses when an option is selected and collapseOnSelect is enabled', async () => {
      harness.rerender({ collapseOnSelect: true })

      await userEvent.type(harness.input, 'aus')
      await userEvent.click(harness.options[0])

      expect(harness.isExpanded()).toBe(false)
    })

    it('maintains the active option after options are selected/deleted', async () => {
      await userEvent.type(harness.input, 'bahrain{arrowdown}')
      expect(harness.options.length).toBe(1)
      expect(harness.activeOption.textContent).toBe('Bahrain')

      await userEvent.click(harness.activeOption)
      expect(harness.options.length).toBe(207)
      expect(harness.activeOption.textContent).toBe('Bahrain')
    })

    it('calls the onExpand and onCollapse callbacks when expanded and collapsed', () => {
      harness.listBoxExpand()
      expect(harness.props.onExpand).toHaveBeenCalledOnce()

      harness.listBoxCollapse()
      expect(harness.props.onCollapse).toHaveBeenCalledOnce()
    })

    it('calls the onShouldExpand callback before being expanded', () => {
      harness.rerender({ onShouldExpand: () => false })
      expect(harness.isCollapsed()).toBe(true)

      harness.listBoxExpand()
      expect(harness.isCollapsed()).toBe(true)
    })

    it('calls the onShouldCollapse callback before being collapsed', () => {
      harness.rerender({ onShouldCollapse: () => false })

      harness.listBoxExpand()
      expect(harness.isExpanded()).toBe(true)

      harness.listBoxCollapse()
      expect(harness.isExpanded()).toBe(true)
    })

    describe('with activateFirstOption enabled', () => {
      beforeEach(() => {
        harness.rerender({ activateFirstOption: true })
      })

      it('sets the first option to active when expanded', async () => {
        await harness.listBoxExpand()
        expect(harness.activeOption.textContent).toBe('Afghanistan')
      })

      it('maintains the first option as active after typing', async () => {
        await userEvent.type(harness.input, 'aus')
        expect(harness.activeOption.textContent).toBe('Australia')
      })

      it('selects the first option after typing', async () => {
        await userEvent.type(harness.input, 'p{enter}')
        expect(harness.props.onAdd).toHaveBeenCalledWith(
          expect.objectContaining({ label: 'Cape Verde' })
        )
      })

      it('wraps the active option from first to last and vice-versa', async () => {
        await userEvent.type(harness.input, 'aus')

        const [option1, option2] = harness.options

        expect(harness.activeOption).toBe(option1)

        await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
        expect(harness.activeOption).toBe(option2)

        await userEvent.type(harness.input, '{arrowdown}', { skipClick: true })
        expect(harness.activeOption).toBe(option1)

        await userEvent.type(harness.input, '{arrowup}', { skipClick: true })
        expect(harness.activeOption).toBe(option2)
      })
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
      expect(harness.props.onAdd).toHaveBeenCalledWith({ label: 'boop', value: 'boop' })
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
        const matcher = new RegExp(query, 'i')

        return suggestions
          .filter((option) => matcher.test(option.label))
          .map((option) => ({
            label: `## ${option.label}`,
            value: option.value,
          }))
      }

      harness = new Harness({ suggestions, suggestionsTransform })
    })

    it('uses provided suggestionsTransform callback when initialised', async () => {
      await harness.listBoxExpand()

      expect(harness.options.length).toBe(207)
      expect(harness.options[1].textContent).toMatch('##')
    })

    it('uses provided suggestionsTransform callback when filtering', async () => {
      await userEvent.type(harness.input, 'uni')

      expect(harness.options.length).toBe(5)
      expect(harness.options[1].textContent).toMatch('##')
    })

    it('uses provided suggestionsTransform when input is cleared', async () => {
      await userEvent.type(harness.input, 'uni')

      harness.api.input.value = ''

      await waitFor(() => expect(harness.options.length).toBe(207))

      expect(harness.options[1].textContent).toMatch('##')
    })
  })

  describe('render props', () => {
    it('renders a custom root component when provided', () => {
      const renderer: Harness['props']['renderRoot'] = ({
        children,
        classNames,
        isActive,
        isDisabled,
        isInvalid,
        ...props
      }) => (
        <div
          className={classNames.root}
          {...props}
          title="Custom root"
          data-is-active={isActive}
          data-is-disabled={isDisabled}
          data-is-invalid={isInvalid}
        >
          {children}
        </div>
      )

      harness = new Harness({ renderRoot: renderer })

      expect(harness.root.id).toBe('react-tags')
      expect(harness.root.title).toBe('Custom root')
    })

    it('renders a custom label component when provided', () => {
      const renderer: Harness['props']['renderLabel'] = ({ children, classNames, id }) => (
        <p id={id} className={classNames.label}>
          Custom {children}
        </p>
      )

      harness = new Harness({ renderLabel: renderer })

      expect(harness.label.id).toBe('react-tags-label')
      expect(harness.label.textContent).toBe('Custom Select tags')
    })

    it('renders custom option components when provided', () => {
      const renderer: Harness['props']['renderOption'] = ({ children, classNames, ...props }) => (
        <div className={classNames.option} {...props}>
          Custom {children}
        </div>
      )

      harness = new Harness({ renderOption: renderer, suggestions })

      harness.listBoxExpand()

      expect(harness.options.length).toBeGreaterThan(0)

      harness.options.forEach((option) => {
        expect(option.id).toMatch(/^react-tags-option-/)
        expect(option.textContent).toMatch(/Custom [\w\s]+/)
      })
    })

    it('renders custom highlight components when provided', async () => {
      const renderer: Harness['props']['renderHighlight'] = ({ text }) => {
        return <b>Custom {text}</b>
      }

      harness = new Harness({ renderHighlight: renderer, suggestions })

      await userEvent.type(harness.input, 'uni')

      expect(harness.options.length).toBeGreaterThan(0)

      harness.options.forEach((option) => {
        expect(option.innerHTML).toMatch(/<b>Custom uni<\/b>/i)
      })
    })

    it('renders a custom tag list component when provided', () => {
      const renderer: Harness['props']['renderTagList'] = ({ children, classNames, ...props }) => (
        <ul id="custom-tag-list" className={classNames.tagList} {...props}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return (
                <li className={classNames.tagListItem} key={child.key}>
                  {child}
                </li>
              )
            }
          })}
        </ul>
      )

      harness = new Harness({ renderTagList: renderer, selected: [{ ...suggestions[10] }] })

      expect(harness.selectedList.id).toBe('custom-tag-list')
    })

    it('renders custom selected tag components when provided', () => {
      const renderer: Harness['props']['renderTag'] = ({ classNames, tag, ...props }) => (
        <button className={classNames.tag} {...props}>
          Custom {tag.label}
        </button>
      )

      harness = new Harness({ renderTag: renderer, selected: [{ ...suggestions[10] }] })

      expect(harness.selectedTags.length).toBeGreaterThan(0)

      harness.selectedTags.forEach((option) => {
        expect(option.textContent).toMatch(/Custom [\w\s]+/)
      })
    })

    it('renders a custom input component when provided', () => {
      const renderer: Harness['props']['renderInput'] = ({ classNames, inputWidth, ...props }) => (
        <input
          className={classNames.input}
          style={{ width: inputWidth }}
          title="Custom input"
          {...props}
        />
      )

      harness = new Harness({ renderInput: renderer })

      expect(harness.input.id).toBe('react-tags-input')
      expect(harness.input.title).toBe('Custom input')
    })

    it('renders a custom list box component when provided', () => {
      const renderer: Harness['props']['renderListBox'] = ({ children, classNames, ...props }) => (
        <div className={classNames.listBox} {...props}>
          Custom {children}
        </div>
      )

      harness = new Harness({ renderListBox: renderer, suggestions })

      harness.listBoxExpand()

      expect(harness.listBox.textContent).toMatch(/Custom [\w\s]+/)
    })
  })

  describe('public API', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions })
    })

    it('assigns the API to a ref if provided', () => {
      expect(harness.api).toBeDefined()
    })

    it('provides control of the input focus', () => {
      harness.api.input.focus()
      expect(document.activeElement).toBe(harness.input)

      harness.api.input.blur()
      expect(document.activeElement).toBe(document.body)
    })

    it('provides control of the input value', () => {
      act(() => {
        harness.api.input.value = 'aus'
      })

      expect(harness.api.input.value).toBe('aus')
    })

    it('provides control of the listbox state', () => {
      act(() => {
        harness.api.listBox.expand()
      })

      expect(harness.api.listBox.isExpanded).toBe(true)

      act(() => {
        harness.api.listBox.collapse()
      })

      expect(harness.api.listBox.isExpanded).toBe(false)
    })

    it('provides access to the active listbox option', async () => {
      expect(harness.api.listBox.activeOption).toBeUndefined()

      await userEvent.type(harness.input, '{arrowdown}')

      expect(harness.api.listBox.activeOption).toEqual({
        value: 0,
        label: 'Afghanistan',
      })
    })

    it('provides access to select action', async () => {
      await userEvent.type(harness.input, '{arrowdown}')

      harness.api.select()

      expect(harness.props.onAdd).toHaveBeenCalledWith({ value: 0, label: 'Afghanistan' })
    })
  })
})
