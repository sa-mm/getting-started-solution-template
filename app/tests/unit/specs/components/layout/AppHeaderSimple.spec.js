import Vue from 'vue'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'
import { shallowMount } from '@vue/test-utils'
import AppHeaderSimple from '@/components/layout/AppHeaderSimple.vue'

const factory = overrides => {
  const localVue = Vue

  // to avoid 'component not registered' warning
  localVue.component(
    Vue.component('router-link', {
      template: `<div><slot /></div>`
    })
  )
  let defaults = {
    vuetify: new Vuetify(),
    localVue,
    propsData: {
      authenticated: false
    },
    mocks: {
      $route: {
        name: 'LandingPage'
      }
    }
  }
  merge(defaults, overrides)
  return shallowMount(AppHeaderSimple, defaults)
}

describe('AppHeaderSimple.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = factory()
  })
  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    expect(wrapper.contains(AppHeaderSimple)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('shows login button', () => {
    test('when not authenticated and not on login page', () => {
      expect(wrapper.contains('[data-qa=HeaderLoginButton]')).toBe(true)
    })
  })

  describe('hides login button', () => {
    test('when authenticated', () => {
      wrapper = factory({ propsData: { authenticated: true } })
      wrapper.vm.$nextTick()
      expect(wrapper.contains('[data-qa=HeaderLoginButton]')).toBe(false)
    })

    test('when on login page', () => {
      const wrapper = factory({ mocks: { $route: { name: 'LoginPage' } } })
      expect(wrapper.contains('[data-qa=HeaderLoginButton]')).toBe(false)
    })
  })
})
