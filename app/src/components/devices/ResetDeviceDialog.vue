<template>
  <StandardDialog
    v-model="open"
    :persistent="false"
    confirm-text="Reset device"
    confirm-color="accent"
    :action="resetDevice"
    width="600"
    @action-done="$emit('action-done')"
  >
    <template slot="title">
      Reset device {{ device.identity }}
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.helpDevice" target="_blank">
        <v-icon>
          help
        </v-icon>
      </a>
    </template>
    <template slot="content">
      Warning: By resetting a device you will lose ownership of it.
    </template>
  </StandardDialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    device: {
      type: Object,
      required: true
    },
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: false
    }
  },
  watch: {
    value() {
      this.open = this.value
    },
    open() {
      this.$emit('input', this.open)
      !this.open && this.$emit('close-dialog')
    }
  },
  methods: {
    async resetDevice() {
      const result = await this.device.reset(this.device)
      if (result.error) {
        this.$parent.$emit('openSnackbar', 'error', result.error)
      } else {
        this.$parent.$emit('openSnackbar', '', 'Device reset successfully')
      }

      return result
    }
  }
}
</script>
