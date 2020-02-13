<template>
  <StandardDialog
    v-model="open"
    :persistent="false"
    width="500"
    :confirm-text="confirmText"
    :action="action"
    :loading="loading"
    :allow-enter-submit="askForApps"
    @action-done="$emit('action-done')"
  >
    <template slot="title">
      {{ dialogTitle }}
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.help" target="_blank">
        <v-icon router to="">
          help
        </v-icon>
      </a>
    </template>
    <template slot="content">
      <div v-if="claimError">
        <div>{{ claimError }}</div>
      </div>

      <div v-else-if="claimSuccess">
        <div>{{ claimSuccess }}</div>
      </div>

      <div v-if="!claimError && askForApps">
        <v-switch
          v-model="claimToDefault"
          label="Claim to default apps"
          primary
        ></v-switch>
        <v-checkbox
          v-if="claimToDefault"
          v-model="rememberDefault"
          class="mb-0 mt-n3 standard-checkbox"
          label="Remember for next claims"
          color="primary"
        />
      </div>
    </template>
  </StandardDialog>
</template>

<script>
import api from '@/api'

export default {
  props: {
    branding: {
      type: Object,
      required: true
    },
    claimCode: {
      type: String,
      required: true
    },
    userlessClaim: {
      type: Boolean,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: false,
      claimSuccess: '',
      claimError: '',
      askForApps: true,
      loading: false,
      rememberDefault: true,
      claimToDefault: true
    }
  },
  computed: {
    dialogTitle() {
      if (this.claimError) {
        return `Couldn't claim device`
      }
      if (this.claimSuccess) {
        return 'Claim code scanned successfully'
      }

      return 'QR Code Scanned'
    },
    confirmText() {
      if (this.claimError) {
        return 'Scan again'
      }
      if (this.claimSuccess) {
        return 'New scan'
      }

      return 'Claim device'
    },
    action() {
      if (!this.claimError && this.askForApps) {
        return this.claimDevice
      }

      return this.closeDialogAsync
    }
  },
  watch: {
    value() {
      this.open = this.value
    },
    open() {
      this.$emit('input', this.open)
      !this.open && this.$emit('close-dialog')

      if (this.open) {
        this.reset()
      }
    }
  },
  methods: {
    reset() {
      this.claimSuccess = ''
      this.claimError = ''

      if (!this.claimCode) {
        this.claimError = 'Error: Invalid claim code format'
        return
      }

      if (!this.askForApps) {
        this.claimDevice()
      }
    },
    async claimDevice() {
      this.loading = true
      const deviceToClaim = {
        code: this.claimCode,
        default: this.claimToDefault
      }

      const result = await api.claimDevice(deviceToClaim)
      this.$parent.$emit(
        'openSnackbar',
        result.error ? 'error' : 'success',
        result.message
      )

      if (result.error) {
        this.claimError = result.message
      } else {
        this.claimSuccess = result.message
      }

      if (this.rememberDefault) {
        this.askForApps = false
      }
      this.loading = false
    },
    closeDialogAsync() {
      return new Promise(resolve => {
        ;(this.open = false), resolve()
      })
    }
  }
}
</script>
