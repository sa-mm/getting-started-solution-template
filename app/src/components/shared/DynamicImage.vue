<template>
  <img
    :alt="imageAlt"
    :src="imageSrc"
    :class="imageClass"
    :style="imageStyle"
    data-qa="DynamicImg"
    @error="handleError"
  />
</template>

<script>
export default {
  name: 'DynamicImage',
  props: {
    imageAlt: {
      type: String,
      required: true
    },
    imageSources: {
      type: Array,
      required: true
    },
    imageClass: {
      type: String,
      required: false,
      default: ''
    },
    imageStyle: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      imageIndex: 0
    }
  },
  computed: {
    imageSrc() {
      return this.imageSources[this.imageIndex]
    }
  },
  methods: {
    handleError() {
      if (this.imageIndex + 1 >= this.imageSources.length) return

      this.imageIndex += 1
    }
  }
}
</script>
