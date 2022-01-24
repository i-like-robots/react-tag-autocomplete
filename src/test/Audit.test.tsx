import axe from 'axe-core'
import { describe, it } from 'vitest'
import { Harness } from './Harness'
import { suggestions } from '../../example/src/countries'

describe('Axe a11y audit', () => {
  it('has no basic accessibility issues', (done) => {
    const harness = new Harness({
      selected: [suggestions[10], suggestions[100]],
      suggestions,
    })

    harness.listBoxExpand()

    axe.run(harness.result.container, (error, results) => {
      if (error) {
        return done(error)
      }

      const violations = results.violations.map((violation) => {
        const issues = violation.nodes.map((node) => {
          const selector = node.target.join(', ')
          return `${selector} ➡ ${node.failureSummary}`
        })

        return issues.join('\n')
      })

      done(violations.length ? new Error(violations.join('\n\n')) : undefined)
    })
  })
})
