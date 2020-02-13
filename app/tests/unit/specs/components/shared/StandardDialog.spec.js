import merge from 'lodash.merge'

import { shallowComponent } from '@/../tests/unit/common'
import StandardDialog from '@/components/shared/StandardDialog.vue'

const defaultProps = {
  propsData: {
    value: false
  },
  stubs: {
    StandardDialog: "<div class='stub'></div>"
  }
}

const factory = overrides =>
shallowComponent(StandardDialog, merge(defaultProps, overrides))

describe('StandardDialog.vue', () => {
  test('can be mounted', () => {
    const wrapper = factory()
    expect(wrapper.contains(StandardDialog)).toBe(true)
  })

  test('sets correct default variables', () => {
    const data = StandardDialog.data()
    expect(data.show).toBe(false)
    expect(data.localLoading).toBe(false)
  })

  test('sets correct default props', () => {
    const wrapper = factory()
    // test that we were returned a promise by checking for .then
    expect(typeof wrapper.vm.action().then).toBe('function')
    expect(typeof wrapper.vm.validate).toBe('function')
  })

  test('calls actions when validated and save is clicked', done => {
    let wrapper
    const props = {
      value: true,
      confirmButton: true,
      validate: jest.fn(() => true),
      action: jest.fn(() => {
        expect(wrapper.vm.localLoading).toBe(true)
        return Promise.resolve()
      })
    }
    wrapper = factory({
      propsData: props
    })
    wrapper.vm.$on('close', () => {
      expect(wrapper.vm.localLoading).toBe(false)
      done()
    })
    expect(props.validate).not.toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()
    expect(wrapper.vm.localLoading).toBe(false)
    wrapper.vm.$forceUpdate()
    wrapper.find('.dialog-confirm').trigger('click')
    expect(props.validate).toHaveBeenCalled()
    expect(props.action).toHaveBeenCalled()
  })

  test('does not call a validate or action if already loading', async () => {
    const props = {
      value: true,
      confirmButton: true,
      validate: jest.fn(() => false),
      action: jest.fn(() => Promise.resolve())
    }
    const wrapper = factory({
      propsData: props
    })
    expect(props.validate).not.toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()
    expect(wrapper.vm.localLoading).toBe(false)
    wrapper.vm.localLoading = true
    wrapper.vm.$forceUpdate()
    await wrapper.vm.$nextTick()
    wrapper.find('.dialog-confirm').trigger('click')
    expect(props.validate).not.toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()
    expect(wrapper.vm.localLoading).toBe(true)
  })

  test('doesnt call a action if not validated', () => {
    const props = {
      value: true,
      validate: jest.fn(() => false),
      action: jest.fn(() => Promise.resolve())
    }
    const wrapper = factory({
      propsData: props
    })
    expect(props.validate).not.toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()
    expect(wrapper.vm.localLoading).toBe(false)
    wrapper.find('.dialog-confirm').trigger('click')
    expect(props.validate).toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()
    expect(wrapper.vm.localLoading).toBe(false)
  })

  test('doesnt validate or mutate when cancel is clicked', done => {
    const props = {
      value: true,
      validate: jest.fn(() => true),
      action: jest.fn(() => Promise.resolve())
    }
    const wrapper = factory({
      propsData: props
    })

    wrapper.vm.$on('close', () => {
      expect(wrapper.vm.localLoading).toBe(false)
      done()
    })

    expect(wrapper.vm.localLoading).toBe(false)
    expect(props.validate).not.toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()

    wrapper.find('.dialog-cancel').trigger('click')

    expect(wrapper.vm.localLoading).toBe(false)
    expect(props.validate).not.toHaveBeenCalled()
    expect(props.action).not.toHaveBeenCalled()
  })
})
