import { shallowComponent } from '@/../tests/unit/common'
import LoadingView from '@/components/shared/LoadingView.vue'

const factory = overrides => shallowComponent(LoadingView, overrides)

describe('LoadingView.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(LoadingView)).toBe(true)
  })

  test('matches snapshot', () => {
    const wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })
})
