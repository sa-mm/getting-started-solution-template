<template>
  <StandardDialog
    v-model="open"
    :persistent="false"
    confirm-text="Apply"
    cancel-text="Close"
    :action="editDevices"
    @action-done="$emit('action-done')"
  >
    <template slot="title"
      >Configure apps for {{ devices.length }} selected
      {{ devices.length == 1 ? 'device' : 'devices' }}</template
    >
    <template slot="topRightIcon">
      <a :href="branding.links.helpDevice" target="_blank">
        <v-icon>help</v-icon>
      </a>
    </template>
    <template slot="content">
      <v-list v-for="item in apps" :key="item.id">
        <template>
          <v-list-item @click.stop="toggleStatus(item)">
            <v-list-item-action>
              <v-checkbox
                :value="item.new_state"
                :value-comparator="compareStatus"
                :indeterminate="item.new_state === 'partial'"
              />
            </v-list-item-action>
            <v-list-item-content :class="item.action">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-list>
    </template>
  </StandardDialog>
</template>

<style scoped>
.add {
  background: var(--v-primary-base);
}
.remove {
  background: var(--v-error-base);
}
</style>

<script>
import deviceapi from '@/api/devices'
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    devices: {
      type: Array,
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
      open: false
    }
  },
  watch: {
    value() {
      this.open = this.value
    },
    devices() {
      this.refreshAppDeviceState()
    },
    apps() {
      this.refreshAppDeviceState()
    },
    open() {
      this.$emit('input', this.open)
      !this.open && this.$emit('close-dialog')
      if (this.open) {
        this.reset()
      }
    }
  },
  mounted() {
    this.refreshAppDeviceState()
  },
  methods: {
    reset() {},
    compareStatus(s) {
      return s === 'enabled'
    },
    toggleStatus(app) {
      if (app.new_state == 'enabled') {
        if (app.current_state === 'partial') {
          app.new_state = app.current_state
        } else {
          app.new_state = 'disabled'
        }
      } else if (app.new_state === 'partial') {
        app.new_state = 'disabled'
      } else {
        app.new_state = 'enabled'
      }
      this.$forceUpdate()
    },
    refreshAppDeviceState() {
      const devices = this.devices.length
      for (const id in this.apps) {
        const app = this.apps[id]
        const hasapp = this.devices.filter(d => d.apps && d.apps.includes(id))
          .length
        if (devices === hasapp) {
          app.current_state = 'enabled'
        } else if (hasapp == 0) {
          app.current_state = 'disabled'
        } else {
          app.current_state = 'partial'
        }
        app.new_state = app.current_state
      }
    },
    editDevices() {
      const applist = Object.values(this.apps).filter(
        a => a.current_state !== a.new_state
      )
      const add_apps = applist
        .filter(a => a.new_state === 'enabled')
        .map(a => a.id)
      const remove_apps = applist
        .filter(a => a.new_state === 'disabled')
        .map(a => a.id)
      const devices = this.devices.map(d => d.identity)
      return deviceapi.edit(devices, add_apps, remove_apps)
    }
  }
}
</script>
