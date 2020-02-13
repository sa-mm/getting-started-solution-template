<template>
  <StandardDialog v-model="open" persistent width="700">
    <template slot="title">
      Application added successfully
    </template>
    <template slot="topRightIcon">
      <a :href="branding.links.helpApp" target="_blank">
        <v-icon>
          help
        </v-icon>
      </a>
    </template>
    <template slot="content">
      <div v-if="appToken" class="subtitle-1">
        App Token:
        <div
          class="primary--text mt-1"
          :class="{ 'body-2': $vuetify.breakpoint.xs }"
          :style="{ wordBreak: 'break-all' }"
        >
          {{ appToken }}
        </div>
        <input id="appToken" :value="appToken" type="hidden" />
      </div>
    </template>
    <template slot="actions">
      <v-spacer />
      <v-btn
        text
        class="mr-2"
        data-qa="AppTokenButtonClose"
        @click="open = false"
        >Close</v-btn
      >
      <v-tooltip
        :key="tokenCopied"
        :disabled="!tokenCopied"
        top
        close-delay="700"
      >
        <template v-slot:activator="{ on }">
          <div v-if="appToken" v-on="on">
            <v-btn
              color="primary"
              data-qa="AppTokenButtonCopy"
              @click="copyToken"
            >
              Copy Token
            </v-btn>
          </div>
        </template>
        <span>Token copied!</span>
      </v-tooltip>
    </template>
  </StandardDialog>
</template>

<script>
import helper from '@/misc/helper'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    appToken: {
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
      open: false,
      tokenCopied: false
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
      this.tokenCopied = false
    },
    copyToken() {
      const appTokenEl = document.querySelector('#appToken')
      helper.copyToClipboard(appTokenEl)
      this.tokenCopied = true
    }
  }
}
</script>
