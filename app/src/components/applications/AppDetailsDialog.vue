<template>
  <StandardDialog
    v-model="open"
    :action="action"
    :persistent="false"
    :secondary-action="openApp"
    :secondary-button="!!app.u"
    :valid="valid && isModified"
    :validate="validate"
    allow-enter-submit
    cancel-button
    cancel-text="close"
    secondary-text="See app"
    submit
    width="550"
    action-done="action-done"
  >
    <template slot="title">
      <template v-if="app.url">
        <a :href="app.url" target="_blank">{{ app.name }}</a>
      </template>
      <template v-else>
        {{ app.name }}
      </template>
      <v-chip class="ml-2" :color="app.type === 1 ? '#baf1ff' : ''">
        {{ app.managed ? 'Managed' : app.type === 1 ? 'Murano' : 'External' }}
      </v-chip>
      <v-chip class="ml-2" @click="CheckDevicesfromApp(app.id)">
        Show Devices
      </v-chip>
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.helpApp" target="_blank">
        <v-icon>help</v-icon>
      </a>
    </template>
    <template slot="content">
      <v-subheader>Id: {{ app.id }}</v-subheader>
      <v-card-text v-if="app.description">
        <p class="mb-0">
          {{ app.description }}
        </p>
      </v-card-text>
      <v-form
        ref="appDetailsForm"
        v-model="valid"
        class="capitalize-select-form"
        @submit.prevent
      >
        <v-switch
          v-model="appDefault"
          label="Automatically add new devices to this App."
          primary
        ></v-switch>
        <v-text-field
          v-if="app.type === 2 && !app.managed"
          v-model="httpsTarget"
          :rules="[
            v => /^https:\/\//.test(v) || 'Must start with https://',
            v => /^https:\/\/.+\..+/.test(v) || 'Invalid URL'
          ]"
          data-qa="ExternalHttpsInput"
          label="HTTPS callback URL"
          required
          primary
          class="my-1"
        />
        <v-select
          v-if="app.type === 2 && !app.managed"
          v-model="authType"
          :items="authTypeOptions"
          data-qa="AppAuthTypeInput"
          item-text="name"
          item-value="id"
          label="Authentication type"
          class="capitalize-select"
          primary
        />
        <v-text-field
          v-if="app.type === 2 && !app.managed && authType == 'token'"
          v-model="tokenPrefix"
          :rules="[v => /^[\w]*$/.test(v) || 'Invalid token format']"
          data-qa="TokenPrefixInput"
          label="Token prefix"
          required
          primary
          class="mb-2"
        />
        <v-text-field
          v-if="app.type === 2 && !app.managed"
          v-model="authSecret"
          data-qa="AuthSecretInput"
          label="Auth Secret"
          required
          primary
          class="mb-2"
        />
        <v-subheader v-if="app.type === 2 && !app.managed"
          >Info (optional)</v-subheader
        >
        <v-divider v-if="app.type === 2 && !app.managed"></v-divider>
        <v-text-field
          v-if="app.type === 2 && !app.managed"
          v-model="appName"
          data-qa="AppNameInput"
          label="Name"
          primary
        />
        <v-text-field
          v-if="app.type === 2 && !app.managed"
          v-model="appDescription"
          data-qa="AppDescriptionInput"
          label="Description"
          primary
        />
        <v-text-field
          v-if="app.type === 2 && !app.managed"
          v-model="appUrl"
          data-qa="AppUrlInput"
          label="Link"
          primary
        />
        <v-text-field
          v-if="app.type === 2 && !app.managed"
          v-model="appLogo"
          data-qa="AppLogoInput"
          label="Logo Url"
          primary
        />
        <v-alert
          v-if="app.tr_st"
          :type="appStatus"
          class="mt-4"
          :class="{ 'app-status': !app.tr_err }"
          data-qa="StatusAlertqa"
          outlined
        >
          Last Callback Status:
          <v-chip :color="appStatus" style="color: white">{{
            app.tr_st
          }}</v-chip>
          <div>{{ app.tr_err }}</div>
        </v-alert>
        <div v-if="!app.c" class="font-italic mt-4">Hasn't connected yet</div>
      </v-form>
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
      appName: '',
      appUrl: '',
      appDescription: '',
      appLogo: '',
      appDefault: true,
      httpsTarget: 'https://',
      authType: 'basic',
      authSecret: '',
      tokenPrefix: '',
      authTypeOptions: ['basic', 'token'],
      open: false,
      valid: false
    }
  },
  computed: {
    appStatus() {
      return !!this.app.tr_st && this.app.tr_st < 400 ? 'success' : 'error'
    },
    isModified() {
      if (this.app.default !== this.appDefault) {
        return true
      }

      if (this.app.type === 2) {
        if (
          this.app.name !== this.appName ||
          this.app.description !== this.appDescription ||
          this.app.url !== this.appUrl ||
          this.app.logo !== this.appLogo ||
          this.app.td.c !== this.httpsTarget ||
          this.app.td.t !== this.authType ||
          (this.app.td.t === 'token' && this.app.td.tp !== this.tokenPrefix)
        ) {
          return true
        }
      }

      return false
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
    openApp() {
      window.open(this.app.url)
    },
    reset() {
      if (this.app.type === 2 && this.app.td) {
        this.httpsTarget = this.app.td.c
        this.authType = this.app.td.t || 'basic'
        this.$nextTick(() => {
          this.tokenPrefix = this.app.td.tp || ''
        })
      }
      this.appName = this.app.name
      this.appDescription = this.app.description
      this.appUrl = this.app.url
      this.appLogo = this.app.logo
      this.appDefault = this.app.default
      this.authSecret = ''
    },
    async action() {
      const editedProps = { default: this.appDefault }
      if (this.app.type === 2) {
        const td = { c: this.httpsTarget, t: this.authType }
        if (this.appName !== '') {
          editedProps.name = editedProps.n = this.appName
        }
        if (this.appDescription) {
          editedProps.d = this.appDescription
        }
        if (this.appUrl) {
          editedProps.u = this.appUrl
        }
        if (this.appLogo) {
          editedProps.l = this.appLogo
        }
        if (this.authType) {
          td.tp = this.tokenPrefix
        }
        if (this.authSecret !== '') {
          td.s = this.authSecret
        }
        editedProps.td = td
      }

      const result = await this.app.edit(editedProps)

      if (result.error) {
        this.$parent.$emit('openSnackbar', 'error', result.error.toString())
      }

      return result
    },
    validate() {
      return this.$refs.appDetailsForm.validate()
    },
    CheckDevicesfromApp(app_id) {
      this.$router.push({ name: 'DevicesPage', params: { select: app_id } })
    }
  }
}
</script>

<style lang="scss">
.app-status {
  height: 55px;
}
</style>
