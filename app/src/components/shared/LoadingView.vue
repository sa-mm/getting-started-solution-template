<template>
  <v-row justify="center" align="center">
    <v-col class="text-center">
      <v-progress-circular :size="50" color="primary" indeterminate />
      <div class="mt-6" :class="textColorClass">{{ text }}</div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
      default: ''
    },
    textColorClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
