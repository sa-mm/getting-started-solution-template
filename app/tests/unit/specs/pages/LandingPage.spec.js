import merge from 'lodash.merge'

import { shallowComponent } from '@/../tests/unit/common'
import branding from '@/../vendor/branding.json'
import LandingPage from '@/pages/LandingPage'


const defaultProps = {
  propsData: {
    branding
  }
}

const factory = overrides =>
  shallowComponent(LandingPage, merge(defaultProps, overrides))

describe('LandingPage.vue', () => {
  const wrapper = factory()

  test('can be mounted', () => {
    expect(wrapper.contains(LandingPage)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
