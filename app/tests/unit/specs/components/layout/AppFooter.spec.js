import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import AppFooter from '@/components/layout/AppFooter.vue'
import branding from '@/../vendor/branding.json'

const defaultProps = {
  propsData: {
    value: true,
    companyName: branding.companyName,
    links: branding.links
  }
}

const factory = overrides =>
  shallowComponent(AppFooter, merge(defaultProps, overrides))

describe('AppFooter.vue', () => {
  const wrapper = factory()

  test('can be mounted', () => {
    expect(wrapper.contains(AppFooter)).toBe(true)
  })

  test('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
