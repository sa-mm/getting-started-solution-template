import Vue from 'vue'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'
import { shallowMount } from '@vue/test-utils'
import { QrcodeStream } from 'vue-qrcode-reader'

import branding from '@/../vendor/branding.json'
import QRScanPage from '@/pages/QRScanPage'

const factory = overrides => {
  const localVue = Vue
  localVue.use(Vuetify)

  let defaults = {
    localVue,
    vuetify: new Vuetify(),
    propsData: {
      branding,
      authenticated: true
    },stubs: ['router-link'],
    mocks: {
      $route: {
        name: 'QRScanPage',
        params: {},
        query: {}
      }
    }
  }
  merge(defaults, overrides)
  return shallowMount(QRScanPage, defaults)
}

describe('QRScanPage.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(QRScanPage)).toBe(true)
  })

  test('matches snapshot', () => {
    const wrapper = factory()
    expect(wrapper.element).toMatchSnapshot()
  })

  test('handles on decode event by calling onDecode', () => {
    const wrapper = factory()
    const onDecodeSpy = jest.fn()
    wrapper.setMethods({
      onDecode: onDecodeSpy
    })

    expect(onDecodeSpy).not.toHaveBeenCalled()
    const qrScanner = wrapper.find(QrcodeStream)
    qrScanner.vm.$emit('decode')
    expect(onDecodeSpy).toHaveBeenCalled()
  })

  test('handles init event by calling onInit', () => {
    const wrapper = factory()
    const onInitSpy = jest.fn()
    wrapper.setMethods({
      onInit: onInitSpy
    })

    expect(onInitSpy).not.toHaveBeenCalled()
    const qrScanner = wrapper.find(QrcodeStream)
    qrScanner.vm.$emit('init')
    expect(onInitSpy).toHaveBeenCalled()
  })
})
