import Vue from 'vue'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'
import { shallowMount } from '@vue/test-utils'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import branding from '@/../vendor/branding.json'

const factory = overrides => {
  const localVue = Vue
  localVue.use(Vuetify)
  // to avoid 'component not registered' warning
  localVue.component(
    Vue.component('router-link', {
      render: () => `<div><slot /></div>`
    })
  )

  let defaults = {
    localVue,
    propsData: {
      value: true,
      branding
    },
    mocks: {
      $route: {
        name: 'DevicesPage'
      }
    }
  }
  merge(defaults, overrides)
  return shallowMount(AppDrawer, defaults)
}

describe('AppDrawer.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = factory()
  })
  afterEach(() => wrapper.destroy())

  test('can be shallowMounted', () => {
    expect(wrapper.contains(AppDrawer)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
