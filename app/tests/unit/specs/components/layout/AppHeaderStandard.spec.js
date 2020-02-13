import Vue from 'vue'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'
import { mount } from '@vue/test-utils'
import AppHeaderStandard from '@/components/layout/AppHeaderStandard.vue'
import branding from '@/../vendor/branding.json'

const factory = overrides => {
  const localVue = Vue
  // to avoid 'component not registered' warning
  localVue.component(
    Vue.component('router-link', {
      render: () => `<div><slot /></div>`
    })
  )

  let defaults = {
    localVue,
    vuetify: new Vuetify(),
    propsData: {
      branding,
      userEmail: 'tester@email.com'
    },
    mocks: {
      $route: {
        name: 'DevicesPages'
      }
    }
  }
  merge(defaults, overrides)
  return mount(AppHeaderStandard, defaults)
}

describe('AppHeaderStandard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = factory()
  })
  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    expect(wrapper.contains(AppHeaderStandard)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  test('toggles app drawer on toggle button click', () => {
    const drawerToggle = wrapper.find('[data-qa=HeaderDrawerToggleButton]')
    expect(wrapper.vm.drawerActive).toBe(false)
    drawerToggle.trigger('click')
    expect(wrapper.vm.drawerActive).toBe(true)
    drawerToggle.trigger('click')
    expect(wrapper.vm.drawerActive).toBe(false)
  })
})
