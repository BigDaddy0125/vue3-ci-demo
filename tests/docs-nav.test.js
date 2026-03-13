import { describe, expect, it } from 'vitest'
import { docsContent, docsNav } from '../src/docs/nav'

describe('Docs navigation', () => {
  it('exposes documentation routes', () => {
    expect(Array.isArray(docsNav)).toBe(true)
    expect(docsNav.length).toBeGreaterThanOrEqual(12)
    expect(docsNav.some((d) => d.slug === 'constitution')).toBe(true)
    expect(docsNav.some((d) => d.slug === 'market-opportunity')).toBe(true)
  })

  it('exposes launch metadata for documents', () => {
    expect(docsContent['architecture'].track).toBe('Engineering')
    expect(docsContent['security'].status).toBeTruthy()
    expect(docsContent['financial-projections'].source).toMatch(/^https:\/\//)
    expect(Array.isArray(docsContent['pitch-deck'].audience)).toBe(true)
  })
})

