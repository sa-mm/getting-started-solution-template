<template>
  <div>
    <AppDrawer v-model="drawerActive" :branding="branding" />
    <v-app-bar color="primary" app dark class="pr-1">
      <v-app-bar-nav-icon
        class="ml-3"
        data-qa="HeaderDrawerToggleButton"
        @click="drawerActive = !drawerActive"
      />
      <v-toolbar-title class="hidden-xs-only" v-text="branding.title" />
      <v-spacer />
      <v-btn color="accent" class="mr-0" @click="$emit('openClaimDevice')"
        >Claim Device</v-btn
      >
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            class="mx-2 text-none"
            data-qa="HeaderMenuActivator"
            color="primary"
            depressed
            v-on="on"
          >
            <span class="hidden-xs-only mr-1" right>{{ userEmail }}</span>
            <v-icon>person</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            key="logout"
            data-qa="HeaderLogoutButton"
            @click="$emit('logout')"
          >
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import AppDrawer from '@/components/layout/AppDrawer'

export default {
  name: 'AppHeaderStandard',
  components: {
    AppDrawer
  },
  props: {
    branding: {
      type: Object,
      required: true
    },
    userEmail: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      drawerActive: false
    }
  }
}
</script>
