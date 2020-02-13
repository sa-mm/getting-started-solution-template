import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import ResetDeviceDialog from '@/components/devices/ResetDeviceDialog.vue'
import branding from '@/../vendor/branding'

const fakeDevice = {
  identity: 'device1',
  online: true,
  lastIp: '255.255.255.255',
  lastSeen: 12343344,
  state: {},
  group: {
    id: 'groupOneId'
  }
}

const defaultProps = {
  propsData: {
    branding,
    value: true,
    device: fakeDevice
  }
}

const factory = overrides =>
  shallowComponent(ResetDeviceDialog, merge(defaultProps, overrides))

describe('ResetDeviceDialog.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(ResetDeviceDialog)).toBe(true)
  })
})
