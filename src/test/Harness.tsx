import React from 'react'
import { vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { ReactTags } from '..'
import type { ReactTagsProps } from '..'
import type { RenderResult } from '@testing-library/react'

// HACK: <https://github.com/jsdom/jsdom/issues/1695>
window.HTMLElement.prototype.scrollIntoView = vi.fn()

export class Harness {
  public props: ReactTagsProps
  public result: RenderResult

  constructor(props: Partial<ReactTagsProps> = {}) {
    const defaultProps = {
      tags: [],
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

  get selectedList(): HTMLUListElement {
    return this.root.querySelector('.react-tags__selected')
  }

  get selectedItems(): HTMLLIElement[] {
    return Array.from(this.selectedList.querySelectorAll('.react-tags__selected-item'))
  }

  get selectedTags(): HTMLButtonElement[] {
    return Array.from(this.selectedList.querySelectorAll('.react-tags__selected-tag'))
  }

  get combobox(): HTMLDivElement {
    return this.root.querySelector('.react-tags__search')
  }

  get input(): HTMLInputElement {
    return this.combobox.querySelector('.react-tags__search-input')
  }

  get sizer(): HTMLDivElement {
    return this.combobox.querySelector('.react-tags__search-input + div[style]')
  }

  get listBox(): HTMLDivElement {
    return this.combobox.querySelector('.react-tags__suggestions')
  }

  get options(): HTMLDivElement[] {
    return Array.from(this.combobox.querySelectorAll('.react-tags__suggestions-item'))
  }

  get activeOption(): HTMLDivElement {
    return this.combobox.querySelector('.is-active')
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
