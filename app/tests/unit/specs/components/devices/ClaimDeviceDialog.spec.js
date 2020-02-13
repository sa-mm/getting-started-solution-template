import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import ClaimDeviceDialog from '@/components/devices/ClaimDeviceDialog.vue'
import branding from '@/../vendor/branding'

const defaultProps = {
  // set sync to false to fix "Cannot read property '_transitionClasses' of undefined"  error
  // https://github.com/vuejs/vue-test-utils/issues/829
  sync: false,
  propsData: {
    branding,
    value: false,
    readOnlyClaim: false,
    claimCodeQuery: '',
  }
}

const factory = overrides =>
  shallowComponent(ClaimDeviceDialog, merge(defaultProps, overrides))

describe('ClaimDeviceDialog.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = factory()
  })
  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    expect(wrapper.contains(ClaimDeviceDialog)).toBe(true)
  })

  test('when no claim query do not set readonly', () => {
    expect(wrapper.vm.readOnlyClaim).toBe(false)
  })

  test('when passed claimQuery set to readonly and change claim code', async () => {
    wrapper.setProps({ claimCodeQuery: 'dummyClaimQuery'})

    await expect(wrapper.vm.claimCode).toBe('')

    wrapper.vm.checkQuery()

    await wrapper.vm.$nextTick()
    await expect(wrapper.vm.claimCode).toBe('dummyClaimQuery')
    await expect(wrapper.vm.readOnlyClaim).toBe(true)
  })
})
