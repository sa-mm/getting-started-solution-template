import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import AppDetailsDialog from '@/components/applications/AppDetailsDialog.vue'
import branding from '@/../vendor/branding'

const defaultProps = {
  propsData: {
    branding,
    value: true,
    app: {
      n: 'myTestApp',
      type: 1,
      tr_st: 200,
      d: 'This is my great awesome app',
      url: 'http://www.example.com'
    },
    appUrl: ''
  },
  computed: {
    appStatus() {
      return !!this.app.tr_st && this.app.tr_st < 400 ? 'success' : 'error'
    },
    isModified() {
      this.appUrl = this.app.url
    }
  }
}

const factory = overrides =>
  shallowComponent(AppDetailsDialog, merge(defaultProps, overrides))

describe('AppDetailsDialog.vue', () => {
  const wrapper = factory()

  test('can be mounted', () => {
    expect(wrapper.contains(AppDetailsDialog)).toBe(true)
  })
})

test('to match snapshot', () => {
  const wrapper = factory()
  expect(wrapper.element).toMatchSnapshot()
})

describe('make link or not on title of app',() => {
  test('no url will not show links', async () => {
    const wrapper = factory()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('a').at(0).attributes('href')).toBe("http://www.example.com")
  })
})

describe('Can display specific message gieven value of tr_st',() => {
  test('success message ', () => {
    const wrapper = factory()
    expect(wrapper.findAll('[data-qa=StatusAlertqa]').at(0).attributes('type')).toBe('success')
  })
})
