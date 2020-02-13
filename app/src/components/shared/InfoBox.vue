<template>
  <v-row
    :class="{ 'subtitle-1': $vuetify.breakpoint.xs }"
    class="headline fill-height"
    justify="center"
    align="center"
  >
    <v-card
      :class="{
        'px-6': $vuetify.breakpoint.xs,
        'px-10': !$vuetify.breakpoint.xs
      }"
      class="center py-10 text-center elevation-5 border-radius-1"
    >
      <div
        v-for="text in texts"
        :key="text"
        class="mb-2"
        :class="{ 'accent--text': error }"
      >
        {{ text }}
      </div>
      <div v-if="btnText">
        <span>Go ahead and</span>
        <v-btn
          class="ml-3"
          color="accent"
          :small="$vuetify.breakpoint.xs"
          data-qa="InfoBoxButton"
          @click="$emit('action')"
          >{{ btnText }}</v-btn
        >
      </div>
      <div class="mt-6">
        <a
          :href="links.help"
          class="subtitle-1 info-box__link"
          target="_blank"
          primary--text
          >Need help?</a
        >
      </div>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'InfoBox',
  props: {
    texts: {
      type: Array,
      required: true
    },
    btnText: {
      type: String,
      default: ''
    },
    links: {
      type: Object,
      required: true
    },
    error: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.info-box {
  &__link {
    text-decoration: underline;
  }
}
</style>
