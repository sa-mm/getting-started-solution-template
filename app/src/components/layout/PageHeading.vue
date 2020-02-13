<template>
  <div
    class="mt-4 pr-2 pl-6 page-heading"
    :class="{ 'mb-2': $vuetify.breakpoint.xs, 'mb-4': !$vuetify.breakpoint.xs }"
  >
    <h1 class="hidden-sm-and-up headline mt-4">{{ name }}</h1>
    <v-row align="center">
      <h1 class="hidden-xs-only mr-5">{{ name }}</h1>
      <slot />
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      required: true,
      type: String
    }
  }
}
</script>

<style lang="scss">
.page-heading {
  h1 {
    font-weight: 300;
  }

  @media only screen and (min-width: 601px) {
    min-height: 60px;
    display: flex;
    align-items: flex-end;
  }
}
</style>
