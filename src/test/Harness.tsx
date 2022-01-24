import React from 'react'
import { vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { ReactTags } from '..'
import type { ReactTagsProps } from '..'
import type { MockedFunction } from 'vitest'
import type { RenderResult } from '@testing-library/react'
import type { OnAddition, OnDelete } from '../sharedTypes'

// HACK: <https://github.com/jsdom/jsdom/issues/1695>
window.HTMLElement.prototype.scrollIntoView = vi.fn(() => null)
window.HTMLElement.prototype.scrollTo = vi.fn(() => null)
export type MockedOnAddition = MockedFunction<OnAddition>
export type MockedOnDelete = MockedFunction<OnDelete>

export class Harness {
  public props: ReactTagsProps
  public result: RenderResult

  constructor(props: Partial<ReactTagsProps> = {}) {
    const defaultProps: ReactTagsProps = {
      selected: [],
      suggestions: [],
      onAddition: vi.fn(() => true),
      onDelete: vi.fn(() => true),
    }

    this.props = { ...defaultProps, ...props }
    this.result = render(this.component)
  }

  get component(): React.ReactElement<ReactTagsProps> {
    return <ReactTags {...this.props} />
  }

  get root(): HTMLDivElement {
    return document.querySelector('.react-tags')
  }

  get label(): HTMLDivElement {
    return this.root.querySelector('.react-tags__label')
  }

  get selectedList(): HTMLUListElement {
    return this.root.querySelector('.react-tags__list')
  }

  get selectedItems(): HTMLLIElement[] {
    return Array.from(this.selectedList.querySelectorAll('.react-tags__list-item'))
  }

  get selectedTags(): HTMLButtonElement[] {
    return Array.from(this.selectedList.querySelectorAll('.react-tags__tag'))
  }

  get combobox(): HTMLDivElement {
    return this.root.querySelector('.react-tags__combobox')
  }

  get input(): HTMLInputElement {
    return this.combobox.querySelector('.react-tags__combobox-input')
  }

  get sizer(): HTMLDivElement {
    return this.combobox.querySelector('.react-tags__combobox-input + div[style]')
  }

  get listBox(): HTMLDivElement {
    return this.root.querySelector('.react-tags__listbox')
  }

  get options(): HTMLDivElement[] {
    return Array.from(this.listBox.querySelectorAll('.react-tags__listbox-option'))
  }

  get activeOption(): HTMLDivElement {
    return this.listBox.querySelector('.is-active')
  }

  get announcements(): HTMLDivElement {
    return this.root.querySelector('div[role="status"]')
  }

  isExpanded(): boolean {
    return this.input.getAttribute('aria-expanded') === 'true'
  }

  isCollapsed(): boolean {
    return this.input.getAttribute('aria-expanded') === 'false'
  }

  listBoxExpand(): void {
    if (this.isCollapsed()) fireEvent.focus(this.input)
  }

  listBoxCollapse(): void {
    if (this.isExpanded()) fireEvent.blur(this.input)
  }
}
