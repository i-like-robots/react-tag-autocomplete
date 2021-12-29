import userEvent from '@testing-library/user-event'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { Harness } from './Harness'
import { countrySuggestions as suggestions } from '../../example/src/countries'

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

    it('removes the label from the layout', () => {
      const result = Array.from(harness.label.style)
      expect(result).toEqual(expect.arrayContaining(['position', 'width', 'height']))
    })
  })

  describe('selected tags list', () => {
    const tags = [{ ...suggestions[0] }, { ...suggestions[1] }]

    beforeEach(() => {
      harness = new Harness({ suggestions, tags })
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

      harness.props.tags = harness.props.tags.slice(1)
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
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('react-tags-listbox-0')

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.input.getAttribute('aria-activedescendant')).toBe('react-tags-listbox-1')
    })

    it('calls the addition callback when an unselected option is active and enter key is pressed', () => {
      userEvent.type(harness.input, 'aus{arrowdown}{enter}')

      expect(harness.props.onAddition).toHaveBeenCalledWith({
        value: 10,
        label: 'Australia',
      })
    })

    it('calls the delete callback when a selected option is active and enter key is pressed', () => {
      harness.props.tags = [{ ...suggestions[10] }]
      harness.result.rerender(harness.component)

      userEvent.type(harness.input, 'aus')
      userEvent.type(harness.input, '{arrowdown}{enter}')

      expect(harness.props.onDelete).toHaveBeenCalledWith(0)
    })

    it('calls the addition callback when the input value matches an option and enter key is pressed', () => {
      userEvent.type(harness.input, 'france{enter}')

      expect(harness.props.onAddition).toHaveBeenCalledWith({
        value: 63,
        label: 'France',
      })
    })

    it('clears the input when an option is selected', () => {
      userEvent.type(harness.input, 'france{enter}')
      expect(harness.input.value).toBe('')
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

      userEvent.type(harness.input, '{esc}')
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(0, 0)

      userEvent.type(harness.input, '{arrowup}', {
        initialSelectionStart: 0,
        initialSelectionEnd: 0,
      })
      expect(harness.isExpanded()).toBe(true)
    })

    it('expands the list box when the cursor is at the end and down key is pressed', () => {
      userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      userEvent.type(harness.input, '{esc}')
      expect(harness.isExpanded()).toBe(false)

      userEvent.type(harness.input, '{arrowdown}')
      expect(harness.isExpanded()).toBe(true)
    })

    it('does not expand the list box when text is selected and up/down key is pressed', () => {
      userEvent.type(harness.input, 'uni')
      expect(harness.isExpanded()).toBe(true)

      userEvent.type(harness.input, '{esc}')
      expect(harness.isExpanded()).toBe(false)

      harness.input.setSelectionRange(0, 3)

      userEvent.type(harness.input, '{arrowup}')
      expect(harness.isExpanded()).toBe(false)

      userEvent.type(harness.input, '{arrowdown}')
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

    it('filters suggestions to those that match the query', () => {
      userEvent.type(harness.input, 'united')

      screen.queryAllByRole('option').forEach((option) => {
        expect(option.textContent).toMatch(new RegExp('united', 'i'))
      })
    })

    // it('can handle non-ascii characters', () => {})

    // it('shows a message when there are no suggestions available', () => {})

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
      userEvent.type(harness.input, 'u{arrowdown}{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('United Arab Emirates')

      userEvent.type(harness.input, 'ni')
      expect(harness.activeOption.textContent).toBe('United Arab Emirates')
    })

    it('resets the active option when no longer available after typing', () => {
      userEvent.type(harness.input, 'u{arrowdown}{arrowdown}')
      expect(harness.activeOption.textContent).toBe('Ukraine')

      userEvent.type(harness.input, 'ni')
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
      harness.props.tags = [{ ...suggestions[10] }]
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
  })

  describe('without suggestions', () => {
    beforeEach(() => {
      harness = new Harness({ suggestions: [] })
    })

    it('does not render the list box on focus', () => {
      harness.listBoxExpand()
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('does not change the input expanded state on focus', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-expanded')).toBe('false')
    })

    it('does not associate the input with the list box on focus', () => {
      harness.listBoxExpand()
      expect(harness.input.getAttribute('aria-owns')).toBeNull()
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

  describe('when disabled', () => {
    beforeEach(() => {
      harness = new Harness({ isDisabled: true, tags: [{ ...suggestions[10] }] })
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
})
