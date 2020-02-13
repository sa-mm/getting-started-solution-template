import { shallowComponent } from '@/../tests/unit/common'
import LogoutPage from '@/pages/LogoutPage.vue'

const factory = overrides => shallowComponent(LogoutPage, overrides)

describe('LogoutPage.vue', () => {
  let wrapper = factory()
  test('can be mounted', () => {
    expect(wrapper.contains(LogoutPage)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders landing page and login page links', () => {
    expect(wrapper.contains('[data-qa=LandingPageLink]')).toBe(true)
    expect(wrapper.contains('[data-qa=LoginPageLink]')).toBe(true)
  })
})
