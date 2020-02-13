import merge from 'lodash.merge'
import { mountComponent } from '@/../tests/unit/common'
import AppTokenDialog from '@/components/applications/AppTokenDialog.vue'
import branding from '@/../vendor/branding'

const defaultProps = {
  propsData: {
    branding,
    value: false,
    appToken: 'fakeAppToken'
  }
}

const factory = overrides =>
  mountComponent(AppTokenDialog, merge(defaultProps, overrides))

describe('AppTokenDialog.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = factory()
    wrapper.setProps({
      value: true
    })
  })
  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    expect(wrapper.contains(AppTokenDialog)).toBe(true)
  })

  test('renders copy token and close buttons', () => {
    expect(wrapper.contains('[data-qa=AppTokenButtonClose]')).toBe(true)
    expect(wrapper.contains('[data-qa=AppTokenButtonCopy]')).toBe(true)
  })

  describe('cancel button', () => {
    test('should handle click by closing dialog', () => {
      const cancelButton = wrapper.find('[data-qa=AppTokenButtonClose]')

      expect(wrapper.vm.open).toBe(true)
      cancelButton.trigger('click')
      expect(wrapper.vm.open).toBe(false)
    })
  })

  describe('copy token button', () => {
    test('should not be disabled initially', () => {
      const copyTokenButton = wrapper.find('[data-qa=AppTokenButtonCopy]')
      expect(copyTokenButton.props().disabled).toBe(false)
      expect(wrapper.vm.tokenCopied).toBe(false)
    })
  })
})
