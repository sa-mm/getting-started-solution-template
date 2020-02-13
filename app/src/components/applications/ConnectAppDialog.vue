<template>
  <StandardDialog
    v-model="open"
    :action="connectApp"
    :persistent="false"
    :valid="valid"
    :validate="validate"
    allow-enter-submit
    cancel-button
    confirm-button
    confirm-text="Connect App"
    width="500"
  >
    <template slot="title">
      Connect App
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.helpApp" target="_blank">
        <v-icon>
          help
        </v-icon>
      </a>
    </template>
    <template slot="content">
      <v-form ref="connectAppForm" v-model="valid" @submit.prevent>
        <v-select
          v-model="appType"
          :items="['Murano', 'External HTTPS']"
          data-qa="AppTypeInput"
          label="Type"
          required
          primary
        />
        <v-switch
          v-model="defaultApp"
          label="Automatically add new devices to this App"
          primary
        ></v-switch>
        <v-text-field
          v-if="appType == 'Murano'"
          v-model="muranoSolutionId"
          :rules="[v => !!v || 'Solution ID is required']"
          data-qa="MuranoSolutionIdInput"
          label="SolutionId"
          required
          autofocus
        />
        <v-text-field
          v-if="appType == 'External HTTPS'"
          v-model="httpsTarget"
          :rules="[
            v => /^https:\/\//.test(v) || 'Must start with https://',
            v => /^https:\/\/.+\..+/.test(v) || 'Invalid URL'
          ]"
          data-qa="ExternalHttpsInput"
          label="HTTPS callback URL"
          required
          primary
          @focus="$event.target.select()"
        />
        <v-select
          v-if="appType == 'External HTTPS'"
          v-model="authType"
          :items="authTypeOptions"
          data-qa="AppAuthTypeInput"
          item-text="name"
          item-value="id"
          label="Authentication type"
          autofocus
          primary
        />
        <v-text-field
          v-if="appType == 'External HTTPS' && authType == 'token'"
          v-model="tokenPrefix"
          data-qa="TokenPrefixInput"
          label="Token prefix"
          required
          primary
          class="mb-2"
        />
        <v-text-field
          v-if="appType == 'External HTTPS'"
          v-model="authSecret"
          data-qa="AuthSecretInput"
          label="Auth Secret"
          required
          primary
          class="mb-2"
        />
        <v-subheader v-if="appType == 'External HTTPS'"
          >Info (optional)</v-subheader
        >
        <v-divider v-if="appType == 'External HTTPS'"></v-divider>
        <v-text-field
          v-if="appType == 'External HTTPS'"
          v-model="appName"
          data-qa="AppNameInput"
          label="Name"
        />
        <v-text-field
          v-if="appType == 'External HTTPS'"
          v-model="appDescription"
          data-qa="AppDescriptionInput"
          label="Description"
        />
        <v-text-field
          v-if="appType == 'External HTTPS'"
          v-model="appUrl"
          data-qa="AppUrlInput"
          label="Link"
        />
        <v-text-field
          v-if="appType == 'External HTTPS'"
          v-model="appLogo"
          data-qa="AppLogoInput"
          label="Logo Url"
        />
      </v-form>
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
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      appName: '',
      appDescription: '',
      appUrl: '',
      appLogo: '',
      appType: '',
      muranoSolutionId: '',
      valid: false,
      open: false,
      defaultApp: true,
      httpsTarget: 'https://',
      authType: 'basic',
      authSecret: '',
      tokenPrefix: '',
      authTypeOptions: ['basic', 'token']
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
      this.$nextTick(() => {
        this.$refs.connectAppForm.reset()
        this.appType = 'Murano'
        this.httpsTarget = 'https://'
        this.authType = 'basic'
        this.authSecret = ''
        this.appName = ''
        this.appDescription = ''
        this.appUrl = ''
        this.appLogo = ''
        this.tokenPrefix = ''
        this.muranoSolutionId = ''
        this.defaultApp = true
      })
    },
    async connectApp() {
      const appData = {
        default: this.defaultApp
      }

      let result
      switch (this.appType) {
        case 'Murano':
          result = await api.connectApp(this.muranoSolutionId, appData)
          if (result.status === 404) {
            result.error = `Murano application not found.
            Make sure this application is linked to the Connector.`
          }
          break
        case 'External HTTPS':
          appData.name = this.appName
          appData.description = this.appDescription
          appData.url = this.appUrl
          appData.logo = this.appLogo
          appData.td = {
            c: this.httpsTarget,
            t: this.authType,
            s: this.authSecret
          }
          if (this.authType === 'token' && this.tokenPrefix) {
            appData.td.tp = this.tokenPrefix
          }
          result = await api.addApp(appData)
          break
        default:
          throw new Error(`Unsupported application type '${this.appType}'`)
      }

      if (result && result.error) {
        this.$parent.$emit('openSnackbar', 'error', result.error.toString())
      }

      return result
    },
    validate() {
      return this.$refs.connectAppForm.validate()
    }
  }
}
</script>
