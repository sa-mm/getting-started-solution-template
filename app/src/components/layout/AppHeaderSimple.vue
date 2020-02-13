<template>
  <v-toolbar
    color="primary"
    class="pl-2 pr-4"
    dark
    :max-height="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 56 : 64"
  >
    <router-link class="brandlogo-container" to="/">
      <img
        src="vendor/brandlogo.png"
        alt="brandlogo--header-simple"
        class="brandlogo"
      />
    </router-link>
    <v-spacer />
    <v-btn
      v-if="$route.name !== 'LoginPage' && !authenticated"
      :to="{ name: 'LoginPage' }"
      class="app-header__login-btn font-weight-bold"
      color="secondary"
      outlined
      router
      data-qa="HeaderLoginButton"
    >
      Login
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    authenticated: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss">
.brandlogo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  & > * {
    height: 45px;
  }
}
div.v-toolbar__content {
  padding: 0 !important;
}
</style>
