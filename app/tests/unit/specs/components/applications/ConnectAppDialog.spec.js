import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import ConnectAppDialog from '@/components/applications/ConnectAppDialog.vue'
import branding from '@/../vendor/branding'

const defaultProps = {
  // set sync to false to fix "Cannot read property '_transitionClasses' of undefined"  error
  // https://github.com/vuejs/vue-test-utils/issues/829
  sync: false,
  propsData: {
    branding,
    value: false
  }
}

const factory = overrides =>
  shallowComponent(ConnectAppDialog, merge(defaultProps, overrides))

describe('ConnectAppDialog.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = factory()
    wrapper.setProps({ value: true })
    wrapper.setMethods({ reset: jest.fn(), ConnectApp: jest.fn() })
  })
  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    expect(wrapper.contains(ConnectAppDialog)).toBe(true)
  })

  describe('form inputs', () => {
    test('renders app name, app type and group inputs initially', async () => {
      await wrapper.vm.$nextTick()
      wrapper.vm.reset()
      expect(wrapper.contains('[data-qa=AppNameInput]')).toBe(false)
      expect(wrapper.contains('[data-qa=AppTypeInput]')).toBe(true)
      expect(wrapper.contains('[data-qa=ExternalHttpsInput]')).toBe(false)
    })
    test('renders external https input when external app type selected', async () => {
      wrapper.setData({ appType: 'External HTTPS' })
      await wrapper.vm.$nextTick()
      expect(wrapper.contains('[data-qa=ExternalHttpsInput]')).toBe(true)
    })
  })


})
