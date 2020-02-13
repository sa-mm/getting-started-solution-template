<template>
  <v-container style="height: 100%">
    <PageHeading name="Applications">
      <v-spacer class="hidden-xs-only" />
      <v-btn
        color="primary"
        class="mr-6"
        :small="$vuetify.breakpoint.xs"
        @click="openConnectAppDialog"
      >
        <v-icon left>cloud</v-icon>
        <span>Connect App</span>
      </v-btn>
    </PageHeading>

    <!-- main content -->
    <v-row v-if="!errors" class="px-4">
      <v-col
        v-for="app in Object.values(apps)"
        :key="app.id"
        :class="{ 'px-0': $vuetify.breakpoint.xs }"
        class="pa-2"
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <v-card
          class="border-radius-0 app-card"
          color="white darken-1"
          data-qa="AppCard"
        >
          <v-card-title class="subtitle-1 my-0" primary-title>
            {{ app.name | truncateText(25) }}
            <v-icon
              v-if="app.tr_st && app.tr_st < 400"
              color="success"
              class="ml-2"
              @click="openAppDetailsDialog(app)"
              >check</v-icon
            >
            <v-icon
              v-else-if="app.tr_st && app.tr_st >= 400"
              color="error"
              class="ml-2"
              @click="openAppDetailsDialog(app)"
              >close</v-icon
            >
            <v-spacer />
            <v-chip
              v-if="app.default === true"
              color="accent"
              class="white--text mr-2"
              >Auto-add</v-chip
            >
            <v-chip class="mr-2" :color="app.type === 1 ? '#baf1ff' : ''">{{
              app.managed ? 'Managed' : app.type === 1 ? 'Murano' : 'External'
            }}</v-chip>
          </v-card-title>
          <a v-if="app.url" :href="app.url" target="_blank">
            <div class="app-logo">
              <img :src="getAppImageSrc(app)" alt="application logo" />
            </div>
          </a>
          <div v-else class="app-logo">
            <img :src="getAppImageSrc(app)" alt="application logo" />
          </div>
          <v-card-text v-if="app.description">
            <p class="mb-0">
              {{ app.description | truncateText(120) }}
            </p>
          </v-card-text>
          <v-spacer
            :style="{ 'min-height': !app.description ? '17px' : '' }"
          ></v-spacer>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              class="mr-2 ml-1"
              color="primary"
              outlined
              @click="openAppDetailsDialog(app)"
              >Settings</v-btn
            >
            <v-spacer />
            <v-icon
              v-if="!app.managed"
              class="delete-icon"
              data-qa="AppCardDelete"
              text
              @click="openDeleteAppDialog(app)"
              >delete</v-icon
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <h2 v-if="!errors" class="subtitle-1 my-0 pt-4 pl-3">Connect to ..</h2>
    <v-divider v-if="!errors" />
    <AppCards v-if="!errors" />

    <!-- special cases -->
    <v-row
      v-if="showInfoBox || (appsLoading && !errors)"
      justify="center"
      align="center"
      style="height: 60%"
    >
      <LoadingView v-if="appsLoading && !errors" text="Loading applications" />
      <InfoBox
        v-if="showInfoBox"
        :texts="errors || ['You have no configured apps']"
        :btn-text="!errors ? 'Connect App' : null"
        :links="branding.links"
        :error="!!errors"
        @action="openConnectAppDialog()"
      />
    </v-row>

    <!-- dialogs -->
    <AppDetailsDialog
      v-model="appDetailsDialogOpen"
      :app="selectedApp"
      :branding="branding"
      @action-done="appDetailsSaved"
    />
    <AppTokenDialog
      v-model="appTokenDialogOpen"
      :app-token="appToken"
      :branding="branding"
    />
    <ConnectAppDialog
      v-model="connectAppDialogOpen"
      :apps="apps"
      :selected-app="selectedApp"
      :branding="branding"
      @action-done="openAppTokenDialog"
    />
    <DeleteAppDialog
      v-model="deleteAppDialogOpen"
      :app="appToDelete"
      :branding="branding"
      @action-done="$emit('refetchApps')"
    />
  </v-container>
</template>

<script>
import InfoBox from '@/components/shared/InfoBox'
import AppTokenDialog from '@/components/applications/AppTokenDialog'
import AppDetailsDialog from '@/components/applications/AppDetailsDialog'
import ConnectAppDialog from '@/components/applications/ConnectAppDialog'
import DeleteAppDialog from '@/components/applications/DeleteAppDialog'
import PageHeading from '@/components/layout/PageHeading'
import LoadingView from '@/components/shared/LoadingView'
import AppCards from '@/components/applications/AppCards'

export default {
  name: 'AppSection',
  components: {
    InfoBox,
    AppTokenDialog,
    AppDetailsDialog,
    ConnectAppDialog,
    DeleteAppDialog,
    PageHeading,
    LoadingView,
    AppCards
  },
  props: {
    globalError: {
      type: String,
      required: true
    },
    branding: {
      type: Object,
      required: true
    },
    apps: {
      type: Object,
      required: true
    },
    appsLoading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      search: '',
      appDetailsDialogOpen: false,
      appTokenDialogOpen: false,
      connectAppDialogOpen: false,
      deleteAppDialogOpen: false,
      localError: '',
      appToDelete: {},
      appToken: '',
      selectedApp: {}
    }
  },
  computed: {
    errors() {
      const result = []
      if (this.globalError) {
        result.push(this.globalError)
      }
      if (this.localError) {
        result.push(this.localError)
      }

      return result.length > 0 ? result : null
    },
    showInfoBox() {
      return this.errors || (this.apps.length < 1 && !this.appsLoading)
    },
    showLoading() {
      return this.appsLoading && !this.showInfoBox
    }
  },
  mounted() {
    this.assignApp()
  },
  methods: {
    openAppDetailsDialog(app) {
      this.selectedApp = app
      this.appDetailsDialogOpen = true
    },
    openAppTokenDialog(result) {
      this.$emit('refetchApps')
      this.appToken = result.data.token
      this.appTokenDialogOpen = true
    },
    openConnectAppDialog() {
      this.connectAppDialogOpen = true
    },
    openDeleteAppDialog(app) {
      this.deleteAppDialogOpen = true
      this.appToDelete = app
    },
    getAppImageSrc(app) {
      if (app.logo || app.l) return app.logo || app.l

      return app.type === 1
        ? 'static/apps/murano.png'
        : 'static/apps/external.png'
    },
    appDetailsSaved() {
      this.$emit('refetchApps')
      this.$emit('openSnackbar', 'success', 'Successfully edited application')
    },
    assignApp() {
      if (this.$route && this.$route.params.select) {
        this.selectedApp = this.$route.params.select
        this.appDetailsDialogOpen = true
      }
    }
  }
}
</script>

<style lang="scss">
.api-result {
  background-color: #777;
  color: white;
}
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.v-window {
  height: 100% !important;
}

.app-card {
  height: 100%;
  display: flex !important;
  flex-direction: column;
}

.app-logo {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  img {
    max-height: 100% !important;
    max-width: 80% !important;
  }
}

.app-error {
  margin: 0 !important;
}
</style>
