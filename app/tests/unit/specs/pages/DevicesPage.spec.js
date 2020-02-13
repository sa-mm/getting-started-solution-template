import merge from 'lodash.merge'

import { mountComponent, shallowComponent } from '@/../tests/unit/common'
import branding from '@/../vendor/branding.json'
import DevicesPage from '@/pages/DevicesPage'
import LoadingView from '@/components/shared/LoadingView'
import InfoBox from '@/components/shared/InfoBox'
import PageHeading from '@/components/layout/PageHeading'

const defaultProps = {
  sync: false,
  propsData: {
    branding,
    devicesClaimed: 0,
    globalError: '',
    apps: {}
  }
}

const shallowFactory = overrides =>
  shallowComponent(DevicesPage, merge(defaultProps, overrides))

const mountFactory = overrides =>
  mountComponent(DevicesPage, merge(defaultProps, overrides))

describe('DevicesPage.vue', () => {
  describe('when devices are loading', () => {
    const wrapper = shallowFactory()

    test('can be mounted', () => {
      expect(wrapper.contains(DevicesPage)).toBe(true)
    })

    test('renders only heading and spinner initially', async () => {
      expect(wrapper.contains(PageHeading)).toBe(true)
      expect(wrapper.contains(InfoBox)).toBe(false)
      await wrapper.vm.$forceUpdate()
      expect(wrapper.contains('[data-qa=DevicesTable]')).toBe(true)
    })

    test('there are no devices shows blank devicetable', async ()=> {
      wrapper.vm.devicesLoading = false
      expect(wrapper.contains('[data-qa=DevicesTable]')).toBe(true)
      expect(wrapper.contains(InfoBox)).toBe(false)
    })

    test('there are error shows infoxbox', async ()=> {
      wrapper.vm.globalError = 'No device due to error'
      await wrapper.vm.$nextTick()
      await wrapper.vm.$forceUpdate()
      expect(wrapper.contains(InfoBox)).toBe(true)
    })
  })

  describe('when there are devices loaded', () => {
    const wrapper = mountFactory()
    wrapper.setMethods({ fetchDevices: jest.fn(),delay: jest.fn(),countAllDevices: jest.fn() ,handleDeviceperPage: jest.fn()})
    wrapper.setProps({
      headers: [
        { text: 'Device ID', value: 'identity', sortable: true },
          { text: 'Status', value: 'online', sortable: true },
          { text: 'Last IP', value: 'lastip', sortable: true },
          { text: 'Last Seen', value: 'update', sortable: true },
          { text: 'Apps', value: 'apps', sortable: true }
      ],
      apps: {
        adsfhgdas: {
          name: 'app1',
          tr_st: 200,
          default: true,
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
    })

    wrapper.setData({
      serverItems: 2,
      pageSelect: 1,
      perPageItems: 10,
      devicesLoading: false,
      devices: [
        {
          identity: 'device1',
          online: true,
          lastIp: '255.255.255.255',
          lastSeen: 12343344,
          state: {},
          group: {
            id: 'groupOneId'
          }
        },
        {
          identity: 'device2',
          online: true,
          lastIp: '245.245.255.255',
          lastSeen: 30983433,
          state: {},
          group: {
            id: 'groupOneId'
          }
        }
      ]
    })

    test('renders a device table and a row for each device once data is loaded',  () => {
      //await wrapper.vm.$forceUpdate()
      expect(wrapper.contains('table')).toBe(true)
      //the first tr is for heading, the 2 others for 2 devices on list
      expect(wrapper.findAll('tr').length).toBe(3)
    })

    test('matches snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    test('opens device details dialog if a device row is clicked', async () => {
      wrapper.setMethods({ openDeviceDetailsDialog: jest.fn() })
      expect(wrapper.vm.openDeviceDetailsDialog).not.toHaveBeenCalled()
      wrapper
        .findAll('tr')
        .at(1)
        .trigger('click')
      expect(wrapper.vm.openDeviceDetailsDialog).toHaveBeenCalled()
    })

    test('when selected appId changes, countAllDevices is called again', async () => {
      wrapper.setMethods({ countAllDevices: jest.fn() })
      expect(wrapper.vm.countAllDevices).toHaveBeenCalledTimes(0)

      wrapper.vm.$options.watch.selectedAppId.call(wrapper.vm)
      wrapper.setData({
        selectedAppId: 'foo bar'
      })
      expect(wrapper.vm.countAllDevices).toHaveBeenCalledTimes(1)
    })
  })
})
