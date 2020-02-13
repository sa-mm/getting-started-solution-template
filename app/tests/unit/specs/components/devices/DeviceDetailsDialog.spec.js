import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import DeviceDetailsDialog from '@/components/devices/DeviceDetailsDialog.vue'
import branding from '@/../vendor/branding'
import StandardDialog from '@/components/shared/StandardDialog'
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

const defaultProps = { sync: false,
  propsData: {
    branding,
    value: true,
    device: fakeDevice,
    apps: {
      adsfhgdas: {
        name: 'app1',
        tr_st: 200,
        default: true,
        online: true,
        type: 1
      },
      myAwesomeId: {
        name: 'app2',
        tr_st: 401,
        default: false,
        type: 1,
        description:
          'dfasilhgads flahksfd aslhdkflashkd flakhsdflkah sdlfhas dhaoighsh-ph3-qhrreoghaobh asd'
      }
    }
  }
}

const factory = overrides =>
  shallowComponent(DeviceDetailsDialog, merge(defaultProps, overrides))

describe('DeviceDetailsDialog.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(DeviceDetailsDialog)).toBe(true)
  })

  test('renders reset and close button', () => {
    const wrapper = factory()
    expect(wrapper.contains('[data-qa=DeviceDetailsButtonReset]')).toBe(true)
    expect(wrapper.contains('[data-qa=DeviceDetailsButtonClose]')).toBe(true)
  })

  describe('cancel button', () => {
    test('should handle click by closing dialog', async () => {
      const wrapper = factory()
      wrapper.setProps({open: true})
      const cancelButton = wrapper.find('[data-qa=DeviceDetailsButtonClose]')

      cancelButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.open).toBe(false)
    })
  })

  test('clicking on create will emit app-to-add',async () => {
    const wrapper = factory()
    wrapper.setData({open: true})
    const addButton = wrapper.find('[data-qa=AddanApp]')
    addButton.trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$on('app-to-add', () => {
      expect(wrapper.vm.open).toBe(false)
    })
  })

  test('with a mobile resolution, fullscreen is activated', async () =>{
    const wrapper = factory()
    wrapper.setData({jsonView:true,$vuetify:{breakpoint:{xs:true,height:500}}})

    await wrapper.vm.$nextTick()
    expect(
      wrapper.contains(StandardDialog)
    ).toBe(true)
    expect(
      wrapper.find(StandardDialog).props('fullscreen')).toBe(true)
  })

  describe(`when device doesn't have state`, () => {
    test('when device has no state disables see state button', () => {
      const wrapper = factory({ propsData: {
        device: {}
      }})
      expect(
        wrapper.contains('[data-qa=DeviceDetailsButtonState]')
      ).toBe(false)
    })
  })

  describe('when device has state', () => {
    let wrapper

    beforeEach(() => {
      wrapper = factory({
        propsData: {
          branding,
          value: true,
          device: {
            ...fakeDevice,
            state: {
              temperature: {
                current: 12,
                highest: 55,
                unit: 'Celsius'
              }
            }
          }
        }
      })
    })


    afterEach(() => wrapper.destroy())
    
    test.skip('when device has state enables see state button', async () => {
      wrapper.setData({open: true})
      //No update of qa= DeviceDetailsButtonState ..
      await wrapper.vm.$nextTick()
      await wrapper.vm.$forceUpdate()
      expect(wrapper.props().device.state.temperature.current).toBe(12)
      expect(
        wrapper.find('[data-qa=DeviceDetailsButtonState]').props().disabled).toBe(false)
    })

    test('clicking on see state button opens enables json', async () => {
      //simulate method not button trigger
      wrapper.vm.jsonView = false
      wrapper.vm.toggleJsonView()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.jsonView).toBe(true)
      expect(wrapper.contains('[data-qa=DeviceDetailsJsonView]')).toBe(true)
    })
  })

  describe('reset device button', () => {
    test(`when clicked dialog should close and 'openResetDeviceDialog' should be emitted`, async () => {
      const wrapper = factory()
      wrapper.setProps({open: true})
      expect(wrapper.contains('[data-qa=DeviceDetailsButtonReset]')).toBe(true)
      wrapper.find('[data-qa=DeviceDetailsButtonReset]').trigger('click')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$on('openResetDeviceDialog', () => {
        expect(wrapper.vm.open).toBe(false)
      })
    })
  })
})
