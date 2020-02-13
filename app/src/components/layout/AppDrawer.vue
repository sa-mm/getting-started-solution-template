<template>
  <v-navigation-drawer
    app
    fixed
    width="200"
    :value="value"
    @input="$emit('input', $event)"
  >
    <v-row class="secondary" style="height: 100%">
      <v-col>
        <div class="text-center">
          <DynamicImage
            :image-sources="[
              'vendor/brandlogo-dark.png',
              'vendor/brandlogo.png'
            ]"
            image-class="my-4 mx-auto"
            image-alt="brandlogo"
            image-style="align-self: center; width: 90%"
          />
        </div>
        <v-list>
          <v-list-item
            v-for="(item, i) in drawerItems"
            :key="i"
            :to="item.route ? { name: item.route } : null"
            active-class="primary--text active-link"
            class="white-text darken-2 drawer__tile py-1"
            @click="item.click ? item.click() : null"
          >
            <v-list-item-action>
              <v-icon class="grey--text lighten-2">
                {{ item.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content style="margin-left: -8px">
              <v-list-item-title
                class="drawer-item-title"
                v-text="item.title"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <div class="grey--text mt-auto drawer__company-footer text-center mb-2">
        <span> {{ branding.companyName }} &copy; 2019 </span>
      </div>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import DynamicImage from '@/components/shared/DynamicImage'

export default {
  name: 'AppDrawer',
  components: { DynamicImage },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      drawerItems: [
        {
          icon: 'devices',
          title: 'Devices',
          route: 'DevicesPage'
        },
        {
          icon: 'cloud',
          title: 'Apps',
          route: 'ApplicationsPage'
        },
        {
          icon: 'code',
          title: 'Api',
          click: () => {
            window.open(window.origin + '/docs')
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.v-navigation-drawer {
  /* width: 200px !important; */
  background-color: var(--v-secondary-base) !important;
}
.v-list__tile--active .v-list__tile__action:first-of-type .v-icon {
  color: var(--v-primary-base) !important;
}

.active-link {
  color: var(--v-primary-base) !important;
}

.drawer {
  &__tile {
    transition: all 0.5s ease !important;
    &:hover {
      background-color: var(--v-secondary-lighten1);
    }
  }
  &__company-footer {
    width: 100%;
  }
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .drawer-item-title {
  color: white !important;
}
</style>
