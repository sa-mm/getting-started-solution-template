import { mount, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'
import Vue from 'vue'

// Global components
import StandardDialog from '@/components/shared/StandardDialog.vue'

import filters from '../../src/misc/filters'

/**
 * @function applyComponents
 * @description applies global components to the supplied Vue instance. Modifies in place, returns nothing.
 * @param {Vue} localVue
 */
export function applyComponents(localVue) {
  localVue.component('StandardDialog', StandardDialog)
}

/**
 * @function makeLocalVue
 * @description creates a new vue instance that can be used to mount components
 * includes all required global app mixins / components
 * @returns {Vue} vue instance that can be used when mounting components
 */
export function makeLocalVue() {
  const localVue = Vue
  applyComponents(localVue)
  localVue.filter('truncateText', filters.truncateText)
  localVue.use(Vuetify)
  Vue.use(Vuetify)
  localVue.use(VueRouter)

  return localVue
}

/**
 * @function applyDefaults
 * @param {Vue} localVue
 * @param {Object} overrides
 * @returns {Object} return value can be used in mount or shallowMount
 */
function applyDefaults(localVue, overrides) {
  // const router = new VueRouter({ routes })
  const vuetify = new Vuetify()
  let defaults = {
    localVue,
    vuetify
  }
  merge(defaults, overrides)
  return defaults
}

/**
 * @function mountComponent
 * @param {Component} component - Vue component to mount
 * @param {Object} overrides - optional overrides to apply to vue component (mocks, props, etc.)
 * @returns {Wrapper}
 */
export function mountComponent(component, overrides) {
  const localVue = makeLocalVue()
  localVue.use(Vuetify)
  const defaults = applyDefaults(localVue, overrides)
  return mount(component, defaults)
}

/**
 * @function shallowComponent
 * @param {Component} component - Vue component to mount
 * @param {Object} overrides - optional overrides to apply to vue component (mocks, props, etc.)
 * @returns {Wrapper}
 */
export function shallowComponent(component, overrides) {
  const localVue = makeLocalVue()
  localVue.use(Vuetify)
  const defaults = applyDefaults(localVue, overrides)
  return shallowMount(component, defaults)
}
