import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../src/pages/Home.vue'

let mockedLocale = 'en'

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { locale: mockedLocale } }),
  useRouter: () => ({ push: vi.fn() }),
}))

describe('Home page', () => {
  beforeEach(() => {
    mockedLocale = 'en'
  })

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

  it('renders localized Japanese interface copy', () => {
    mockedLocale = 'ja'

    const wrapper = mount(Home, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.text()).toContain('パイロットを開始')
    expect(wrapper.text()).toContain('公開文書')
    expect(wrapper.text()).toContain('石竹株式会社のサイトへ')
  })
})

