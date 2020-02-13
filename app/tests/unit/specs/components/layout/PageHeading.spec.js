import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import PageHeading from '@/components/layout/PageHeading.vue'

const defaultProps = {
  propsData: {
    name: 'Devices'
  }
}

const factory = overrides =>
  shallowComponent(PageHeading, merge(defaultProps, overrides))

describe('PageHeading.vue', () => {
  const wrapper = factory()

  test('can be mounted', () => {
    expect(wrapper.contains(PageHeading)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
