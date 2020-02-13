<template>
  <StandardDialog
    v-model="open"
    :action="deleteApp"
    :persistent="false"
    confirm-color="accent"
    confirm-text="Remove App"
    width="600"
    @action-done="$emit('action-done')"
  >
    <template slot="title">
      Remove application "{{ app.name }}" ?
    </template>
    <template slot="content">
      All routing to all associated devices will be removed.<br />Managed
      applications will still display on your app list.<br /><br />Warning:
      Removing this application cannot be undone.
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
    app: {
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
    async deleteApp() {
      const { error, data } = await this.app.remove()
      if (error) {
        this.$parent.$emit('openSnackbar', 'error', error)
      } else {
        this.$parent.$emit(
          'openSnackbar',
          '',
          'Application successfully removed'
        )
      }
      return { error, data }
    }
  }
}
</script>
