import merge from 'lodash.merge'
import { mountComponent } from '@/../tests/unit/common'
import JsonView from '@/components/devices/JsonView.vue'

const defaultProps = {
  propsData: {
    jsonData: {
      temperature: {
        current: 12,
        max: 55,
        unit: 'Celsius'
      }
    }
  }
}

const factory = overrides =>
  mountComponent(JsonView, merge(defaultProps, overrides))

describe('JsonView.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(JsonView)).toBe(true)
  })
})
