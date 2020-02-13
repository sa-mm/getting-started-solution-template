import { shallowComponent } from '@/../tests/unit/common'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const factory = overrides => shallowComponent(NotFoundPage, overrides)

describe('NotFoundPage.vue', () => {
  let wrapper = factory()
  test('can be mounted', () => {
    expect(wrapper.contains(NotFoundPage)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders a go home button', () => {
    expect(wrapper.contains('[data-qa=HomePageLink]')).toBe(true)
  })
})
