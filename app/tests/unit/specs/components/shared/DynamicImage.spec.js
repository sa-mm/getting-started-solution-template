import merge from 'lodash.merge'
import { shallowComponent } from '@/../tests/unit/common'
import DynamicImage from '@/components/shared/DynamicImage.vue'

const defaultProps = {
  propsData: {
    imageAlt: 'image alt',
    imageSources: ['source1.png', 'fallback.png']
  }
}

const factory = overrides =>
  shallowComponent(DynamicImage, merge(defaultProps, overrides))

describe('DynamicImage.vue', () => {
  let wrapper

  afterEach(() => wrapper.destroy())

  test('can be mounted', () => {
    wrapper = factory()
    expect(wrapper.contains(DynamicImage)).toBe(true)
  })

  test('matches snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('when handleError method called, image index is changed', () => {
    wrapper = factory()
    expect(wrapper.vm.imageIndex).toBe(0)
    wrapper.vm.handleError()
    expect(wrapper.vm.imageIndex).toBe(1)
  })

  test('when image errors handleError method is called', () => {
    const handleErrorSpy = jest.fn()
    wrapper = factory({
      methods: {
        handleError: handleErrorSpy
      }
    })

    expect(handleErrorSpy).not.toHaveBeenCalled()
    wrapper.find('[data-qa=DynamicImg]').trigger('error')
    expect(handleErrorSpy).toHaveBeenCalledTimes(1)
  })
})
