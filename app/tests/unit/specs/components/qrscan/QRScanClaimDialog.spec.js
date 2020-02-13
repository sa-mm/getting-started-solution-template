import merge from 'lodash.merge'
import { mountComponent } from '@/../tests/unit/common'
import QRScanClaimDialog from '@/components/qrscan/QRScanClaimDialog.vue'
import branding from '@/../vendor/branding'

const claimDeviceSpy = jest.fn()
const defaultProps = {
  // set sync to false to fix "Cannot read property '_transitionClasses' of undefined"  error
  // https://github.com/vuejs/vue-test-utils/issues/829
  sync: false,
  propsData: {
    branding,
    value: false,
    claimCode: 'aDummyClaimCode',
    userlessClaim: false
  },
  methods: {
    claimDevice: claimDeviceSpy
  }
}

// {
//   open: false,
//     claimSuccess: '',
//     claimError: '',
//     askForApps: true,
//     loading: false,
//     rememberDefault: true,
//     claimToDefault: true
// }

const factory = overrides =>
  mountComponent(QRScanClaimDialog, merge(defaultProps, overrides))

describe('QRScanClaimDialog.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = factory()
    wrapper.setProps({ value: true })
  })
  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    expect(wrapper.contains(QRScanClaimDialog)).toBe(true)
  })

  test('should call claimDevice immediately if askForGroup is false', async () => {
    wrapper = factory()
    expect(claimDeviceSpy).not.toHaveBeenCalled()

    wrapper.setData({ askForApps: false })
    await wrapper.vm.$nextTick()
    wrapper.setProps({ value: true })
    await wrapper.vm.$nextTick()
    expect(claimDeviceSpy).toHaveBeenCalledTimes(1)
  })

  test('should set claimError when claimCode is empty', async () => {
    wrapper = factory({ propsData: { claimCode: '' } })
    wrapper.setProps({ value: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.claimError).toBe('Error: Invalid claim code format')
  })
})
