import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import InfoBox from '@/components/shared/InfoBox.vue'
import branding from '@/../vendor/branding'

const defaultProps = {
  propsData: {
    texts: ['This is a sample text'],
    btnText: 'Claim Device',
    links: branding.links,
    error: false
  }
}

const factory = overrides =>
  shallowComponent(InfoBox, merge(defaultProps, overrides))

describe('InfoBox.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(InfoBox)).toBe(true)
  })

  test('matches snapshot', () => {
    const wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders a button when button text supplied', () => {
    const wrapper = factory()
    expect(wrapper.contains('[data-qa=InfoBoxButton]')).toBe(true)
  })

  test(`doesn't render a button when button text not supplied`, () => {
    const wrapper = factory({
      propsData: {
        btnText: ''
      }
    })
    expect(wrapper.contains('[data-qa=InfoBoxButton]')).toBe(false)
  })
})
