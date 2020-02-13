<template>
  <v-dialog
    v-model="show"
    :persistent="persistent || localLoading"
    :max-width="width"
    :fullscreen="fullscreen"
    @keydown.esc="close"
    @keydown.enter="allowEnterSubmit && doAction()"
  >
    <v-card :class="noPadding ? 'pa-0' : 'pa-3'" class="border-radius-1">
      <div v-if="$slots.image">
        <slot name="image" />
      </div>
      <v-card-title
        v-if="$slots.title"
        class="headline standard-dialog-title"
        :class="noPadding ? 'pa-0' : ''"
      >
        <slot name="title" />
        <v-spacer />
        <slot name="topRightIcon" />
      </v-card-title>
      <v-card-text
        ref="content"
        class="standard-dialog-content"
        :class="{
          'pa-0': noPadding,
          'pa-3': !noPadding,
          'standard-dialog-content-fullscreen': fullscreen
        }"
      >
        <slot name="content" />
      </v-card-text>

      <v-card-actions
        v-if="$slots.actions"
        class="standard-dialog-actions pa-4"
      >
        <slot name="actions" />
      </v-card-actions>

      <v-card-actions v-else class="standard-dialog-actions pa-4">
        <v-btn
          v-if="secondaryButton"
          class="dialog-secondary"
          outlined
          color="primary"
          @click.native="handleSecondaryAction()"
        >
          {{ secondaryText }}
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="cancelButton"
          class="dialog-cancel"
          :disabled="localLoading"
          text
          @click.native="close()"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          v-if="confirmButton"
          :color="confirmColor"
          class="dialog-confirm"
          :disabled="!valid || localLoading"
          @click.native="doAction()"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
      <v-progress-linear
        v-if="localLoading"
        absolute
        class="dialog-progress"
        :color="confirmColor"
        :indeterminate="true"
        height="6"
      />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    action: {
      type: Function,
      required: false,
      default: () => Promise.resolve()
    },
    validate: {
      type: Function,
      required: false,
      default: () => true
    },
    valid: {
      type: Boolean,
      required: false,
      default: true
    },
    confirmText: {
      type: String,
      required: false,
      default: 'Save'
    },
    confirmButton: {
      type: Boolean,
      required: false,
      default: true
    },
    confirmColor: {
      type: String,
      required: false,
      default: 'primary'
    },
    cancelText: {
      type: String,
      required: false,
      default: 'Cancel'
    },
    cancelButton: {
      type: Boolean,
      required: false,
      default: true
    },
    allowEnterSubmit: {
      type: Boolean,
      required: false,
      default: false
    },
    secondaryText: {
      type: String,
      required: false,
      default: 'Remove'
    },
    secondaryButton: {
      type: Boolean,
      required: false
    },
    secondaryAction: {
      type: Function,
      required: false,
      default: () => false
    },
    width: {
      type: [Number, String],
      required: false,
      default: 700
    },
    fullscreen: {
      type: Boolean,
      required: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: undefined
    },
    noPadding: {
      type: Boolean,
      required: false,
      default: undefined
    },
    persistent: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      show: false,
      localLoading: false
    }
  },
  watch: {
    value: function(newValue) {
      this.show = newValue
    },
    show: function(newValue) {
      if (!newValue) {
        this.close()
      }
    },
    loading: function(newValue) {
      this.localLoading = newValue
    }
  },
  mounted() {
    this.$emit('input', false)
  },
  methods: {
    handleSecondaryAction() {
      this.secondaryAction()
      this.close()
    },
    close() {
      this.localLoading = false
      this.$emit('input', false)
      this.$emit('close')
    },
    doAction() {
      const validated = this.validate()
      if (validated) {
        this.localLoading = this.loading !== undefined ? this.loading : true
        return this.action()
          .then(result => {
            if (result && result.error) {
              throw new Error(result.error)
            }
            this.$emit('action-done', result)
            this.$parent.$emit('action-done', result)
            this.close()
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.warn('error in dialog action: ', err)
            this.$emit('action-error', err)
            this.localLoading =
              this.loading !== undefined ? this.loading : false
          })
      }
    }
  }
}
</script>

<style>
.standard-dialog-content {
  overflow: auto;
  max-height: calc(100vh - 250px);
}
.standard-dialog-content-fullscreen {
  max-height: calc(100vh - 132px);
  min-height: calc(100vh - 132px);
}
.standard-dialog-content ul {
  list-style-position: inside;
}

.application
  .theme--dark.dialog-confirm.btn.btn--disabled:not(.btn--icon):not(.btn--text) {
  background-color: rgba(0, 0, 0, 0.12) !important;
}

.dialog-progress {
  left: 0;
  bottom: 0;
}
</style>
