<template>
  <v-container class="qr-component text-center pa-0 pb-12">
    <!-- scanner -->
    <QrcodeStream class="qr-scanner" @init="onInit" @decode="onDecode">
      <v-row
        :class="{ 'subtitle-2': $vuetify.breakpoint.xs }"
        class="headline font-weight-bold qr-scanner__heading whitevar--text primary"
        justify="space-between"
      >
        <v-col
          v-if="!cameraLoading && !cameraError"
          class="text-left d-flex align-center"
        >
          <router-link to="/">
            <img
              src="vendor/brandlogo.png"
              alt="brandlogo"
              class="qr-scanner__brandlogo-1"
            />
          </router-link>
        </v-col>
        <v-col class="text-right qr-scanner__right-header">
          Device QR Code Scanner
        </v-col>
      </v-row>

      <!-- pre-camera access -->
      <v-row v-if="cameraLoading || cameraError" justify="center">
        <v-col cols="8">
          <router-link to="/">
            <DynamicImage
              :image-sources="[
                'vendor/brandlogo-dark.png',
                'vendor/brandlogo.png'
              ]"
              image-alt="brandlogo"
              image-class="my-4 qr-scanner__brandlogo-2"
            />
          </router-link>
          <p v-if="cameraLoading" class="whitevar--text">
            Please grant camera access permission to procceed to scanning device
            claim QR code.
          </p>
        </v-col>
      </v-row>
      <v-row v-if="cameraLoading && !cameraError" class="mt-8" justify="center">
        <LoadingView text="Accessing camera" text-color-class="primary--text" />
      </v-row>

      <!-- error -->
      <v-alert :value="!!cameraError" type="error">{{ cameraError }}</v-alert>

      <!-- buttons -->
      <v-row justify="center" class="qr-scanner__buttons">
        <v-btn
          :to="{ name: 'DevicesPage' }"
          class="qr-scanner__buttons--btn"
          color="primary"
          large
          router
          >Close</v-btn
        >
        <v-btn
          :href="branding.links.help"
          class="qr-scanner__buttons--btn"
          color="secondary"
          target="_blank"
          dark
          large
          >Help</v-btn
        >
      </v-row>
    </QrcodeStream>

    <!-- dialogs -->
    <QRScanClaimDialog
      v-model="QRScanClaimDialogOpen"
      :branding="branding"
      :claim-code="claimCode"
      :userless-claim="userlessClaim"
    />
  </v-container>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import DynamicImage from '@/components/shared/DynamicImage'
import QRScanClaimDialog from '@/components/qrscan/QRScanClaimDialog'
import LoadingView from '@/components/shared/LoadingView'

export default {
  name: 'QRScanPage',
  components: {
    QrcodeStream,
    DynamicImage,
    QRScanClaimDialog,
    LoadingView
  },
  props: {
    authenticated: {
      required: true,
      type: Boolean
    },
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      QRScanClaimDialogOpen: false,
      cameraError: '',
      cameraLoading: true,
      claimCode: '',
      userlessClaim: false
    }
  },
  created() {
    if (!this.authenticated && !this.$route.query.session) {
      return this.$router.replace({
        name: 'LoginPage',
        query: { redirect: this.$route.path }
      })
    }

    if (!this.authenticated && this.$route.query.session) {
      this.userlessClaim = true
    }
  },
  methods: {
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.cameraError = 'ERROR: You need to grant camera access permisson'
        } else if (error.name === 'NotFoundError') {
          this.cameraError = 'ERROR: No camera on this device'
        } else if (error.name === 'NotSupportedError') {
          this.cameraError = 'ERROR: Secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.cameraError = 'ERROR: Is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.cameraError = 'ERROR: Installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.cameraError =
            'ERROR: Stream API is not supported in this browser'
        } else {
          this.cameraError = `ERROR: Couldn't access camera`
        }
      }
      this.cameraLoading = false
    },
    onDecode(result) {
      if (!result || this.QRScanClaimDialogOpen) return

      const claimCode = this.parseURL(result)

      this.openQRScanClaimDialog(claimCode)
    },
    parseURL(codeValue) {
      if (!codeValue || typeof codeValue !== 'string') return ''
      const queryString = codeValue.split('?')[1]

      if (!queryString) {
        if (codeValue.match(/https?:\/\/.+\..+/)) return ''

        // code is not a url -> return as it is
        return codeValue
      }

      let result = ''
      queryString.split('&').forEach(query => {
        if (query.split('=')[0] === 'claim' && query.split('=')[1]) {
          result = query.split('=')[1].trim()
        }
      })
      return result
    },
    openQRScanClaimDialog(claimCode) {
      this.claimCode = claimCode
      this.QRScanClaimDialogOpen = true
    }
  }
}
</script>

<style lang="scss">
.qr-component {
  display: flex;
  flex-flow: column nowrap;
}
.qr-scanner {
  margin-top: 60px;
  &__heading {
    width: 100%;
    position: absolute;
    color: #ffffff;
    left: 12px;
    bottom: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  &__right-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
  &__buttons {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 12px;
    @media only screen and (max-width: 2200px) {
      display: flex;
      margin-top: 0 !important;
      &--btn {
        width: 50%;
        margin: 0 !important;
        border-radius: 0;
        color: var(--v-whitevar-base) !important;
      }
    }
  }
  &__brandlogo-1 {
    height: 40px;
    @media only screen and (max-width: 600px) {
      height: 30px;
    }
  }

  &__brandlogo-2 {
    max-height: 75px;
  }
}

div.overlay {
  box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2),
    0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12) !important;
  border-top: 1px solid var(--v-whitevar-base);
}

// style internal QR reader component
camera,
.pause-frame {
  width: 600px;
  height: 500px;
}
</style>
