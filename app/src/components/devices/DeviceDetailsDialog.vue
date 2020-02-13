<template>
  <StandardDialog
    v-model="open"
    :persistent="false"
    :confirm-text="jsonView ? 'Close State' : 'See state (JSON)'"
    :fullscreen="
      ($vuetify.breakpoint.xs && $vuetify.breakpoint.height < 720) ||
        ($vuetify.breakpoint.sm && jsonView)
    "
    :width="!jsonView ? '600' : '1400'"
  >
    <template slot="title">
      {{ device.identity }}
      <v-chip v-if="device.online" class="chip-online ml-4">online</v-chip>
      <v-chip v-else class="chip-offline ml-4">offline</v-chip>
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.helpDevice" target="_blank">
        <v-icon>help</v-icon>
      </a>
    </template>
    <template slot="content">
      <div class="div_sub_header">
        <p style="line-height: 14px;">Ip Adress: {{ device.lastip || '--' }}</p>
        <p style="padding-left:35px;line-height: 14px">
          Last Seen:
          {{
            !device.lastseen
              ? `--`
              : new Date(device.lastseen / 1000).toLocaleString()
          }}
        </p>
      </div>
      <v-subheader class="dialog-subheader">
        Apps
        <i
          class="v-icon notranslate material-icons theme--light margin_have"
          data-qa="AddanApp"
          @click="AddNewAppfromDevice()"
        >
          add_circle
        </i>
      </v-subheader>
      <v-card v-if="(device.apps || []).length > 0" class="mb-3" outlined>
        <v-list class="dialog-card" rounded>
          <v-list-item v-for="(item, i) in device.apps" :key="i" selectable>
            <v-list-item-content>
              <v-list-item-title>
                <div style="display:flex;flex-direction:row">
                  <v-chip class="ml-4">
                    <a
                      @click="
                        $router.push({
                          name: 'ApplicationsPage',
                          params: { select: apps[item] }
                        })
                      "
                    >
                      {{ apps[item] ? apps[item].name : item }}
                    </a>
                  </v-chip>
                  <v-icon
                    class="delete-icon"
                    data-qa="AppCardDelete"
                    text
                    @click="RemoveAppfromDevice(device.identity, apps[item].id)"
                    >delete</v-icon
                  >
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-subheader class="dialog-subheader">Users</v-subheader>
      <v-card outlined>
        <v-list class="dialog-card">
          <v-list-item v-for="(item, i) in device.users" :key="i" selectable>
            <v-list-item-content>
              <v-list-item-title>
                {{ item }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <JsonView
        v-if="jsonView"
        :json-data="device.state"
        data-qa="DeviceDetailsJsonView"
      />
      <v-divider />
    </template>
    <template slot="actions">
      <v-btn
        text
        color="accent"
        data-qa="DeviceDetailsButtonReset"
        class="mr-2"
        @click="openResetDeviceDialog"
        >Reset</v-btn
      >
      <v-spacer />
      <v-btn
        text
        data-qa="DeviceDetailsButtonClose"
        class="mr-2"
        @click="open = false"
        >Close</v-btn
      >
      <v-tooltip
        :disabled="device.state && !Object.keys(device.state).length < 1"
        top
      >
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              outlined
              data-qa="DeviceDetailsButtonState"
              color="primary"
              :disabled="Object.keys(device.state).length < 1"
              class="text-none"
              @click="toggleJsonView"
              >{{ jsonView ? 'Hide State' : 'See State (JSON)' }}</v-btn
            >
          </div>
        </template>
        <span>No state available</span>
      </v-tooltip>
    </template>
  </StandardDialog>
</template>

<script>
import JsonView from '@/components/devices/JsonView'
import deviceapi from '@/api/devices'
export default {
  components: {
    JsonView
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    device: {
      type: Object,
      required: true
    },
    apps: {
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
      open: false,
      jsonView: false
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
      this.jsonView = false
    },
    toggleJsonView() {
      this.jsonView = !this.jsonView

      return new Promise(resolve => resolve())
    },
    openResetDeviceDialog() {
      this.open = false
      this.$emit('openResetDeviceDialog')
    },
    async RemoveAppfromDevice(id_dev, remov_app_id) {
      if (id_dev != '' && remov_app_id != '') {
        var id_dev_l = [id_dev]
        var remov_app_id_l = [remov_app_id]
        await deviceapi.edit(id_dev_l, [], remov_app_id_l)
        this.open = false
        this.$emit('app-configure-done')
      }
    },
    AddNewAppfromDevice() {
      this.open = false
      this.$emit('app-to-add')
    }
  }
}
</script>

<style lang="scss">
.dialog-subheader {
  font-size: 18px !important;
}
.margin_have {
  margin-left: 24px !important;
}
.delete-icon {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.dialog-card {
  background-color: #fafafa !important;
}
.div_sub_header {
  display: flex !important;
  flex-direction: row !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
}
</style>
