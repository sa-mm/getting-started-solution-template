import Vue from 'vue'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'
import { shallowMount } from '@vue/test-utils'

import branding from '@/../vendor/branding.json'
import LoginPage from '@/pages/LoginPage'

const factory = overrides => {
  const localVue = Vue
  localVue.use(Vuetify)

  let defaults = {
    localVue,
    sync: false,
    propsData: {
      branding
    },
    mocks: {
      $route: {
        name: 'LoginPage',
        params: {},
        query: {},
        meta:{ isactiv_auth0: false }
      }
    }
  }
  merge(defaults, overrides)
  return shallowMount(LoginPage, defaults)
}

describe('LoginPage.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(LoginPage)).toBe(true)
  })

  test('matches snapshot', () => {
    const wrapper = factory()
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('activate account form', () => {
    test(`displays activate account form when there is an 'activate' query parameter`, async () => {
      const wrapper = factory({
        mocks: {
          $route: {
            query: {
              activate: 'fakeActivateCode'
            }
          }
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.display).toBe('accountActivation')
      expect(wrapper.contains('[data-qa=ActivateAccountForm')).toBe(true)
      expect(wrapper.contains('[data-qa=SignupForm')).toBe(false)
      expect(wrapper.contains('[data-qa=LoginForm')).toBe(false)
    })
  })
})
