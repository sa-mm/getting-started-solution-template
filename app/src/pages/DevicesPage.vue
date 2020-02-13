<template>
  <v-container style="height: 100%">
    <PageHeading name="Devices">
      <v-tooltip v-model="showTooltip" top :disabled="!!selected.length">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              class="ml-4"
              outlined
              :disabled="!selected.length"
              @click="openAppConfigurationDialog"
            >
              <v-icon left>edit</v-icon>Configure
            </v-btn>
          </div>
        </template>
        <span>Select a device to configure</span>
      </v-tooltip>

      <v-spacer class="hidden-xs-only" />
      <v-col cols="5" md="3" class="mr-4">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          class="standard-search"
        />
      </v-col>
      <v-col cols="5" md="3" lg="2" class="ml-auto">
        <v-select
          v-model="selectedAppId"
          :items="Object.values(apps)"
          :clearable="true"
          label="Filter by app"
          item-text="name"
          item-value="id"
          outlined
          class="standard-select"
        />
      </v-col>
    </PageHeading>

    <!-- main content -->
    <!-- mobile-breakpoint is minimal as it is not used -->
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="devices"
      :search="search"
      item-key="identity"
      :page.sync="pageSelect"
      :server-items-length="serverItems"
      :loading="devicesLoading"
      loading-text="Loading Devices"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50, 100]
      }"
      :items-per-page.sync="perPageItems"
      must-sort
      show-select
      :mobile-breakpoint="200"
      class="elevation-4 border-radius-1 overflow-hidden"
      data-qa="DevicesTable"
      @click:row="openDeviceDetailsDialog"
    >
      <template v-slot:item.lastip="{ item }">
        {{ item.lastip || '-' }}
      </template>
      <template v-slot:item.apps="{ item }">
        {{ (item.apps || []).length }}
      </template>
      <template v-slot:item.update="{ item }">
        {{
          item.lastseen === 0
            ? `Hasn't reported yet`
            : new Date(item.lastseen / 1000).toLocaleString()
        }}
      </template>
      <template v-slot:item.online="{ item }">
        <v-chip v-if="item.online" class="chip-online">online</v-chip>
        <span v-else class="pl-1" color="grey">offline</span>
      </template>
      <template v-slot:no-results>
        <v-alert color="error" icon="warning"
          >Your search for "{{ search }}" found no results.</v-alert
        >
      </template>
    </v-data-table>

    <!-- lazy loading (not implemented yet) -->
    <!-- <v-row v-if="canLoadMore" class="text-center mt-4" justify="center">
      <v-btn outlined @click="loadSomeMore">Load more devices</v-btn>
    </v-row> -->

    <!-- special cases -->
    <v-row
      v-if="showInfoBox"
      justify="center"
      align="center"
      style="height: 60%"
    >
      <InfoBox
        v-if="showInfoBox"
        :texts="errors || ['There are no devices for this app']"
        :btn-text="!errors ? 'Claim Device' : null"
        :links="branding.links"
        :error="!!errors"
        @action="$emit('openClaimDevice')"
      />
    </v-row>

    <!-- dialogs -->
    <DeviceDetailsDialog
      v-model="deviceDetailsDialogOpen"
      :device="selectedDevice"
      :branding="branding"
      :apps="apps"
      @openResetDeviceDialog="openResetDeviceDialog"
      @app-configure-done="appConfigureDone"
      @app-to-add="appToAdd"
    />
    <ResetDeviceDialog
      v-model="resetDeviceDialogOpen"
      :device="selectedDevice"
      :branding="branding"
      @openSnackbar="$emit('openSnackbar')"
      @action-done="fetchDevices"
    />
    <AppConfigurationDialog
      v-model="appConfigurationDialogOpen"
      :apps="apps"
      :devices="selected"
      :branding="branding"
      @openSnackbar="$emit('openSnackbar')"
      @action-done="appConfigureDone"
    />
  </v-container>
</template>

<script>
import InfoBox from '@/components/shared/InfoBox'
import DeviceDetailsDialog from '@/components/devices/DeviceDetailsDialog'
import ResetDeviceDialog from '@/components/devices/ResetDeviceDialog'
import PageHeading from '@/components/layout/PageHeading'
import deviceapi from '@/api/devices'
import AppConfigurationDialog from '@/components/devices/AppConfigurationDialog'

export default {
  components: {
    AppConfigurationDialog,
    InfoBox,
    DeviceDetailsDialog,
    PageHeading,
    ResetDeviceDialog
  },
  props: {
    devicesClaimed: {
      type: Number,
      required: true
    },
    apps: {
      type: Object,
      required: true
    },
    globalError: {
      type: String,
      required: true
    },
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      appConfigurationDialogOpen: false,
      devicesLoading: true,
      search: '',
      devices: [],
      selected: [],
      localError: null,
      selectedAppId: '',
      selectedDevice: { state: {} },
      deviceDetailsDialogOpen: false,
      resetDeviceDialogOpen: false,
      showTooltip: false,
      serverItems: 0,
      pageSelect: 1,
      perPageItems: 10
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
      return this.errors
    },
    headers() {
      if (this.$vuetify.breakpoint.xs) {
        return [
          { text: 'Device ID', value: 'identity', sortable: true },
          { text: 'Status', value: 'online', sortable: true }
        ]
      } else {
        return [
          { text: 'Device ID', value: 'identity', sortable: true },
          { text: 'Status', value: 'online', sortable: true },
          { text: 'Last IP', value: 'lastip', sortable: true },
          { text: 'Last Seen', value: 'update', sortable: true },
          { text: 'Apps', value: 'apps', sortable: true }
        ]
      }
    }
  },
  watch: {
    perPageItems() {
      //wont modify count, just fetch again
      this.fetchDevices()
    },
    pageSelect() {
      //wont modify count, just fetch again
      this.fetchDevices()
    },
    devicesClaimed() {
      this.fetchDevices()
    },
    selectedAppId() {
      //can modify count devices
      this.selected = []
      this.countAllDevices()
    },
    search() {
      //can modify count devices
      //introduce a debouncer to avoid fetch too many times
      this.selected = []
      this.delay(this.countAllDevices(), 500)
    }
  },
  created() {
    this.handleDeviceperPage()
  },
  mounted() {
    this.assignFilter()
    this.countAllDevices()
  },
  methods: {
    appConfigureDone() {
      this.fetchDevices()
      this.selected = []
    },
    openAppConfigurationDialog() {
      this.appConfigurationDialogOpen = true
    },
    async fetchDevices() {
      this.devicesLoading = true
      //get limit and offset, offset is taken from options depending page selected
      const { error, data } = await deviceapi.fetchDevices(
        this.selectedAppId,
        this.search,
        this.perPageItems,
        (this.pageSelect - 1) * this.perPageItems
      )

      if (error) {
        this.$emit('openSnackbar', 'error', error)
        return (this.localError = error.toString())
      } else {
        this.devices = data.devices
      }

      this.devicesLoading = false
    },
    openDeviceDetailsDialog(device) {
      this.selectedDevice = device
      this.deviceDetailsDialogOpen = true
    },
    openResetDeviceDialog() {
      this.resetDeviceDialogOpen = true
    },
    appToAdd() {
      this.selected = [this.selectedDevice]
      this.appConfigurationDialogOpen = true
    },
    assignFilter() {
      if (this.$route && this.$route.params.select) {
        this.selectedAppId = this.$route.params.select
      }
    },
    async countAllDevices() {
      //Detect number of devices, depending seleccted App or Search
      //Result used in pagination footer
      //will call then fetchDevices
      const { error, counter } = await deviceapi.countDevices(
        this.selectedAppId,
        this.search
      )
      if (error) {
        this.$emit('openSnackbar', 'error', error)
        return (this.localError = error.toString())
      } else {
        this.serverItems = counter
        this.fetchDevices()
      }
    },
    delay(callback, ms) {
      var timer = 0
      return function() {
        var context = this,
          args = arguments
        clearTimeout(timer)
        timer = setTimeout(function() {
          callback.apply(context, args)
        }, ms || 0)
      }
    },
    handleDeviceperPage() {
      if (this.$vuetify.breakpoint.height < 720) {
        this.perPageItems = 5
      } else {
        this.perPageItems = 10
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

.border-radius-1 {
  border-radius: 10px !important;
}
.border-radius-0 {
  border-radius: 5px !important;
}
.overflow-hidden {
  overflow: hidden;
}

tr {
  cursor: pointer;
}

.grey-bg {
  background-color: rgb(233, 233, 233);
}
.jsontree_bg {
  background: #fff;
}
</style>
