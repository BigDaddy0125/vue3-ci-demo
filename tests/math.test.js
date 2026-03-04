import { describe, expect, it } from 'vitest'
import { sum } from '../src/utils/math'

describe('sum', () => {
  it('adds two positive numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it('adds negative and positive numbers', () => {
    expect(sum(-1, 2)).toBe(1)
  })
})
