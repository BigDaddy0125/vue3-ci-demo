import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../src/pages/Home.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { locale: 'en' } }),
  useRouter: () => ({ push: vi.fn() }),
}))

describe('Home page', () => {
  it('renders core homepage copy', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Authorization Before Execution')
    expect(wrapper.text()).toContain('Core Guarantees')
  })
})

