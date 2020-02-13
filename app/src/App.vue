<template>
  <div>
    <v-app v-if="brandingStatus === 'applied'" class="app">
      <VueHeadful
        :title="`${branding.title}`"
        :description="branding.description"
      />
      <AppHeaderStandard
        v-if="$route.meta.showToolbar"
        :branding="branding"
        :user-email="profile.email"
        @logout="logout"
        @openClaimDevice="openClaimDeviceDialog"
        @action-done="devicesClaimed += 1"
      />
      <AppHeaderSimple
        v-else-if="!$route.meta.hideHeader"
        :authenticated="!!authenticated"
      />

      <!-- page content -->
      <v-content
        class="grey-bg"
        :class="{ 'secondary-bg': $route.meta.secondaryBg }"
      >
        <router-view
          :authenticated="!!authenticated"
          :devices-claimed="devicesClaimed"
          :apps="apps"
          :apps-loading="appsLoading"
          :global-error="error.toString()"
          :branding="branding"
          @openClaimDevice="openClaimDeviceDialog"
          @openSnackbar="openSnackbar"
          @refetchApps="fetchApps"
        />
      </v-content>
      <!--  -->

      <ClaimDeviceDialog
        v-model="claimDeviceDialogOpen"
        :claim-code-query="$route.query.claim"
        :branding="branding"
        @openSnackbar="openSnackbar"
        @action-done="devicesClaimed += 1"
      />

      <v-snackbar v-model="snackbar.active" :color="snackbar.color">
        {{ snackbar.text }}
        <v-btn dark text @click="snackbar.active = false">Close</v-btn>
      </v-snackbar>

      <AppFooter
        v-if="$route.meta.showFooter"
        :links="branding.links"
        :company-name="branding.companyName"
      />
    </v-app>
    <v-app v-else-if="brandingStatus === 'error'" class="branding-error">
      <v-container style="font-size: 20px">
        Error: Could not load branding.json.
        <v-btn
          href="http://docs.exosite.com/reference/services/asset/"
          outlined
          class="text-none ml-4"
          target="_blank"
          >Learn more</v-btn
        >
      </v-container>
    </v-app>
  </div>
</template>

<script>
import VueHeadful from 'vue-headful'
import AppFooter from '@/components/layout/AppFooter'
import AppHeaderSimple from '@/components/layout/AppHeaderSimple'
import AppHeaderStandard from '@/components/layout/AppHeaderStandard'
import ClaimDeviceDialog from '@/components/devices/ClaimDeviceDialog'
import api from '@/api'
import auth from '@/api/auth'

const getInitialState = () => {
  return {
    authenticated: auth.authenticated,
    autoOpenClaim: true,
    claimDeviceDialogOpen: false,
    devicesClaimed: 0,
    error: '',
    apps: {},
    appsLoading: true,
    profile: { email: '' },
    snackbar: {
      active: false,
      text: '',
      color: ''
    }
  }
}

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeaderSimple,
    AppHeaderStandard,
    ClaimDeviceDialog,
    VueHeadful
  },
  props: {
    branding: {
      type: Object,
      required: true
    },
    brandingStatus: {
      type: String,
      required: true
    }
  },
  data() {
    return getInitialState()
  },
  mounted() {
    this.startAuthListener()

    if (this.authenticated) {
      this.profile = auth.profile()
      this.fetchApps()
    }
  },
  methods: {
    openClaimDeviceDialog() {
      this.claimDeviceDialogOpen = true
    },
    checkClaimQuery() {
      if (this.authenticated && this.$route.query.claim && this.autoOpenClaim) {
        this.autoOpenClaim = false
        this.openClaimDeviceDialog()
        if (this.$route.name !== 'DevicesPage') {
          this.$router.push({
            name: 'DevicesPage',
            query: { claim: this.$route.query.claim }
          })
        }
      }
    },
    openSnackbar(type, text) {
      this.snackbar.color = type
      this.snackbar.text = text
      this.snackbar.active = true
    },
    async fetchApps() {
      const { error, data } = await api.fetchApps()
      this.appsLoading = false
      if (error) {
        this.error = error
        this.openSnackbar('error', error)
        return
      }

      this.apps = data.apps
      this.checkClaimQuery()
    },
    logout() {
      this.resetAppState()
      auth.logout()
      this.$router.replace({ name: 'LogoutPage' })
    },
    resetAppState() {
      Object.assign(this.$data, getInitialState())
    },
    startAuthListener() {
      auth.authNotifier.on('authChange', this.authListener)
    },
    authListener(authState) {
      this.authenticated = authState.authenticated
      if (!this.authenticated) {
        return this.resetAppState()
      }
      if (!auth.profile()) {
        auth.setProfile().then(() => {
          this.profile = auth.profile()
          this.fetchApps()
        })
      }
    }
  }
}
</script>

<style lang="scss">
.app {
  background-color: var(--v-secondary-base) !important;
}

.logo {
  width: 85%;
  margin-left: auto;
  margin-right: auto;
}

.grey-bg {
  background-color: #f0f0f0;
}

.secondary-bg {
  background-color: var(--v-secondary-base) !important;
}

.branding-error {
  .application--wrap {
    min-height: 0 !important;
  }
}

.standard-select {
  div.v-input__slot {
    margin: 0 !important;
  }
  div.v-text-field__details {
    display: none;
  }
}

.standard-search {
  div.v-text-field__details {
    display: none;
  }
}

.standard-checkbox {
  div.v-messages {
    display: none;
  }
  font-size: 14px;
}

.delete-icon {
  border-radius: 10px;
  color: rgb(211, 211, 211) !important;
  padding: 6px;
  transition: all 0.5s ease !important;
  &:hover {
    background-color: rgba(black, 0.1);
    color: var(--v-accent-base) !important;
  }
}

.text-underline {
  border-bottom: 1px solid currentColor;
}

.chip-online {
  background-color: rgba(169, 252, 169, 0.644) !important;
}
</style>
