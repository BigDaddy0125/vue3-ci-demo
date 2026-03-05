import { describe, expect, it } from 'vitest'
import { docsNav } from '../src/docs/nav'

describe('Docs navigation', () => {
  it('exposes documentation routes', () => {
    expect(Array.isArray(docsNav)).toBe(true)
    expect(docsNav.length).toBeGreaterThanOrEqual(8)
    expect(docsNav.some((d) => d.slug === 'constitution')).toBe(true)
  })
})

