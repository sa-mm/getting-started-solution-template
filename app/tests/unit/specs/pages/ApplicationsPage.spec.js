import merge from 'lodash.merge'

import { shallowComponent } from '@/../tests/unit/common'
import branding from '@/../vendor/branding.json'
import ApplicationsPage from '@/pages/ApplicationsPage'
import LoadingView from '@/components/shared/LoadingView'
import InfoBox from '@/components/shared/InfoBox'
import PageHeading from '@/components/layout/PageHeading'

const defaultProps = { sync: false,
  propsData: {
    branding,
    globalError: '',
    localError: '',
    apps: {},
    appsLoading: true,
    selectedApp: '',
    appDetailsDialogOpen: false
  },
  computed:{
    showInfoBox() {
       return !this.appsLoading
    }
  }
}

const factory = overrides =>
  shallowComponent(ApplicationsPage, merge(defaultProps, overrides))

describe('ApplicationsPage.vue', () => {
  describe('when apps are loading', () => {
    const wrapper = factory()

    test('can be mounted', () => {
      expect(wrapper.contains(ApplicationsPage)).toBe(true)
    })

    test('renders only heading and spinner initially', () => {
      expect(wrapper.contains(LoadingView)).toBe(true)
      expect(wrapper.contains(PageHeading)).toBe(true)
      expect(wrapper.contains(InfoBox)).toBe(false)
      expect(wrapper.contains('[data-qa=AppCard]')).toBe(false)
    })

    test('when groups has no apps shows an InfoBox', async () => {
      expect(wrapper.contains(InfoBox)).toBe(false)

      wrapper.setProps({
        appsLoading: false,
        showInfoBox: true
      })
      wrapper.vm.$forceUpdate()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.appsLoading).toBe(false)
      expect(wrapper.contains('[data-qa=AppCard]')).toBe(false)
      expect(wrapper.contains(LoadingView)).toBe(false)
      expect(wrapper.contains(InfoBox)).toBe(true)
    })
  })

  describe('when there are apps loaded', () => {
    let wrapper

    beforeEach(() => {
      wrapper = factory()

      wrapper.setMethods({ fetchApps: jest.fn() })
      wrapper.setProps({
        appsLoading: false,
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
      })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    test('renders an app card each app', () => {
      expect(wrapper.findAll('[data-qa=AppCard]').length).toBe(2)
    })

    test('matches snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    test('opens delete app dialog on when deleteAppDialogOpen called', async () => {
      expect(wrapper.vm.deleteAppDialogOpen).toBe(false)
      wrapper.vm.openDeleteAppDialog({
        aid: 'app1',
        name: 'appName1',
        online: true,
        type: 1
      })
      expect(wrapper.vm.deleteAppDialogOpen).toBe(true)
    })

    test('1st app with error status show second icon, error color', () => {
      expect(wrapper.findAll('.ml-2').at(0).attributes('color')).toBe('success')
    })
    
    test('2nd app with error status show second icon, error color', () => {
      expect(wrapper.findAll('.ml-2').at(1).attributes('color')).toBe('error')
    })
  })
})
    
