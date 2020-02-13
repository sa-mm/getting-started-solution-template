import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import DeleteAppDialog from '@/components/applications/DeleteAppDialog.vue'
import branding from '@/../vendor/branding'

const defaultProps = {
  propsData: {
    branding,
    value: true,
    app: {
      n: 'DummyAppName',
      t: 1,
      group: {
        id: 'dummyGroupId'
      }
    }
  }
}

const factory = overrides =>
  shallowComponent(DeleteAppDialog, merge(defaultProps, overrides))

describe('DeleteAppDialog.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(DeleteAppDialog)).toBe(true)
  })
})
