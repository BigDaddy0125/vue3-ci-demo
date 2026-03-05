import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StateMachine from '../src/components/StateMachine.vue'

describe('StateMachine component', () => {
  it('renders documented authorization states', () => {
    const wrapper = mount(StateMachine)
    const text = wrapper.text()
    expect(text).toContain('INIT')
    expect(text).toContain('AUTHORIZED')
    expect(text).toContain('DEGRADED')
  })
})

