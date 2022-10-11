import React from 'react'
import { vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { ReactTags } from '..'
import type { ReactTagsAPI, ReactTagsProps } from '..'
import type { MockedFunction } from 'vitest'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { OnAdd, OnDelete, OnInput, OnValidate, Tag } from '../sharedTypes'

// HACK: <https://github.com/jsdom/jsdom/issues/1695>
window.HTMLElement.prototype.scrollIntoView = vi.fn(() => null)
window.HTMLElement.prototype.scrollTo = vi.fn(() => null)

export type MockedOnAdd<T extends Tag> = MockedFunction<OnAdd<T>>
export type MockedOnDelete = MockedFunction<OnDelete>
export type MockedOnInput = MockedFunction<OnInput>
export type MockedOnValidate = MockedFunction<OnValidate>

type HarnessProps<T extends Tag> = ReactTagsProps<T> & {
  ref?: React.MutableRefObject<ReactTagsAPI<T>>
}

export class Harness<T extends Tag> {
  public props: HarnessProps<T>
  public result: RenderResult

  constructor(props: Partial<HarnessProps<T>> = {}, options: RenderOptions = {}) {
    const defaultProps: HarnessProps<T> = {
      selected: [],
      suggestions: [],
      onAdd: vi.fn(),
      onDelete: vi.fn(),
      onInput: vi.fn(),
      onValidate: vi.fn(() => true),
    }

    this.props = { ...defaultProps, ...props }
    this.result = render(this.component, options)
  }

  get component(): React.ReactElement<HarnessProps<T>> {
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

  async listBoxExpand(): Promise<void> {
    if (this.isCollapsed()) fireEvent.focus(this.input)
  }

  async listBoxCollapse(): Promise<void> {
    if (this.isExpanded()) fireEvent.blur(this.input)
  }

  rerender(props?: Partial<ReactTagsProps<T>>) {
    if (this.result) {
      Object.assign(this.props, props)
      this.result.rerender(this.component)
    } else {
      throw new Error('No result defined to rerender')
    }
  }
}
