<template>
  <StandardDialog
    v-model="open"
    :action="claimDevice"
    :persistent="false"
    :secondary-action="openQrScan"
    :valid="valid"
    :validate="validate"
    allow-enter-submit
    cancel-button
    confirm-button
    confirm-text="Claim"
    secondary-button
    secondary-text="Scan QR Code"
    width="500"
    @action-done="$emit('action-done')"
  >
    <template slot="title">
      Claim device
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.helpDevice" target="_blank">
        <v-icon>
          help
        </v-icon>
      </a>
    </template>
    <template slot="content">
      <v-form ref="claimForm" v-model="valid" @submit.prevent>
        <div>
          <v-text-field
            v-model="claimCode"
            data-qa="ClaimDeviceDialogCodeInput"
            :readonly="readOnlyClaim"
            :rules="[v => !!v || 'Code is required']"
            class="mb-2"
            label="Claim code"
            required
            autofocus
          />
        </div>
      </v-form>
      <v-switch
        v-model="claimToDefault"
        label="Claim to Auto-add apps"
        primary
      ></v-switch>
    </template>
  </StandardDialog>
</template>

<script>
import api from '@/api'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    claimCodeQuery: {
      type: String,
      required: false,
      default: ''
    },
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: false,
      claimToDefault: true,
      readOnlyClaim: false,
      valid: false,
      claimCode: ''
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
      this.$refs.claimForm.reset()
      // wait for next tick othervise group v-select will not update
      this.$nextTick(() => {
        this.checkQuery()
      })
    },
    validate() {
      return this.$refs.claimForm.validate()
    },
    checkQuery() {
      if (this.claimCodeQuery) {
        this.claimCode = this.claimCodeQuery
        this.readOnlyClaim = true
      } else {
        this.readOnlyClaim = false
      }
    },
    async claimDevice() {
      let deviceToClaim = {
        code: this.claimCode,
        default: this.claimToDefault
      }

      const result = await api.claimDevice(deviceToClaim)
      this.$emit(
        'openSnackbar',
        result.error ? 'error' : 'success',
        result.message
      )

      if (!result.error) {
        this.deleteQuery('claim')
      }

      return result
    },
    deleteQuery(queryName) {
      if (this.$route.query[queryName]) {
        let query = Object.assign({}, this.$route.query)
        delete query[queryName]
        this.$router.replace({ query })
      }
    },
    openQrScan() {
      this.$router.push({ name: 'QRScanPage' })
    }
  }
}
</script>

<style></style>
