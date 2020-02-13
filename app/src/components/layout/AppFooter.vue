<template>
  <footer class="app-footer px-6 py-4 secondary-bg" style="width: 100vw">
    <v-row class="subtitle-1 whitevar--text">
      <v-col
        class="text-center d-flex justify-space-between px-6"
        cols="12"
        sm="4"
        lg="2"
        order-sm="1"
      >
        <a
          :href="links.info"
          target="_blank"
          whitevar--text
          data-qa="AboutLink"
          class="app-footer__link"
          >About</a
        >
        <a
          :href="links.terms"
          target="_blank"
          whitevar--text
          data-qa="TermsLink"
          class="app-footer__link"
          >Terms</a
        >
        <a
          :href="links.help"
          target="_blank"
          whitevar--text
          data-qa="HelpLink"
          class="app-footer__link"
          >Help
        </a>
      </v-col>
      <v-col cols="6" sm="4" lg="5" order-sm="0">
        &copy; {{ new Date().getFullYear() }} —
        {{ companyName }}
      </v-col>
      <v-col cols="6" sm="4" lg="5" class="text-right" order-sm="2">
        <div>
          v. 1.0
        </div>
      </v-col>
    </v-row>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    links: {
      type: Object,
      required: true
    },
    companyName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
.app-footer {
  &__link {
    text-decoration: none;
    transition: all 0.3s ease;
    color: var(--v-whitevar-base) !important;
    &:hover {
      text-decoration: none;
      cursor: pointer;
      color: var(--v-primary-base) !important;
    }
  }
}
</style>
