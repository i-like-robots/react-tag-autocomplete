import React from 'react'
import axe from 'axe-core'
import { afterEach, describe, it } from 'vitest'
import { cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Harness } from './Harness'
import { suggestions } from '../../example/src/countries'

function formatAxeErrors(results: axe.AxeResults): Error {
  const violations = results.violations.map((violation) => {
    const issues = violation.nodes.map((node) => {
      const selector = node.target.join(', ')
      return `${selector} ➡ ${node.failureSummary}`
    })

    return issues.join('\n')
  })

  return violations.length ? new Error(violations.join('\n\n')) : undefined
}

function runAxeTest(container, callback) {
  axe.run(container, (error, results) => {
    if (error) {
      return callback(error)
    }

    callback(formatAxeErrors(results))
  })
}

describe('Axe a11y audit', () => {
  afterEach(() => {
    cleanup()
  })

  it('has no basic accessibility issues with default state', (done) => {
    const harness = new Harness({
      selected: [suggestions[10], suggestions[100]],
      suggestions,
    })

    runAxeTest(harness.result.container, done)
  })

  it('has no basic accessibility issues when listbox is expanded', async (done) => {
    const harness = new Harness({
      selected: [suggestions[10], suggestions[100]],
      suggestions,
    })

    await userEvent.type(harness.input, 'United')

    runAxeTest(harness.result.container, done)
  })

  it('has no basic accessibility issues with invalid state', (done) => {
    const harness = new Harness({
      isInvalid: true,
      ariaErrorMessage: 'error',
      selected: [suggestions[10], suggestions[100]],
      suggestions,
    })

    harness.result.rerender(
      <div>
        {harness.component}
        <p id="error" role="alert">
          This is an error
        </p>
      </div>
    )

    harness.listBoxExpand()

    runAxeTest(harness.result.container, done)
  })

  it('has no basic accessibility issues with disabled state', (done) => {
    const harness = new Harness({
      isDisabled: true,
      selected: [suggestions[10], suggestions[100]],
      suggestions,
    })

    harness.listBoxExpand()

    runAxeTest(harness.result.container, done)
  })
})
