<template>
  <div>
    <v-container class="secondary pa-6" fluid>
      <!-- content page 1 -->
      <v-row align="center" justify="center" style="min-height: 95vh">
        <v-col
          :class="{
            'mr-0': $vuetify.breakpoint.xs || $vuetify.breakpoint.sm,
            'mr-5': !$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm,
            'mb-3': $vuetify.breakpoint.xs || $vuetify.breakpoint.sm,
            'mt-5': $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          }"
          class="landing__left whitevar--text pl-6"
          cols="12"
          sm="10"
          md="5"
        >
          <v-row class="fill-height" align="start" justify="start">
            <h1
              :class="{
                'display-1': $vuetify.breakpoint.xs,
                'display-2': $vuetify.breakpoint.sm
              }"
              class="font-weight-bold mb-4 display-3"
            >
              {{ branding.landingPage.mainSlogan }}
            </h1>
            <h3
              :class="{ title: $vuetify.breakpoint.xs }"
              class="headline mb-4"
            >
              {{ branding.landingPage.secondarySlogan }}
            </h3>
            <v-col class="d-flex pl-0">
              <v-btn
                :to="{ name: 'LoginPage' }"
                :small="$vuetify.breakpoint.xs"
                class="primary ml-0 secondary--text mr-4"
                router
                >Start now</v-btn
              >
              <v-btn
                :href="branding.links.info"
                :small="$vuetify.breakpoint.xs"
                class="white"
                target="_blank"
                >Learn more</v-btn
              >
            </v-col>
          </v-row>
        </v-col>

        <v-col
          :class="{ 'pb-5': $vuetify.breakpoint.xs }"
          cols="12"
          sm="10"
          md="5"
          lg="4"
          class="pa-2 pt-6"
        >
          <div class="device-card elevation-5 py-6">
            <v-col class="d-flex flex-column align-center">
              <h3
                :class="{
                  headline:
                    $vuetify.breakpoint.md ||
                    $vuetify.breakpoint.sm ||
                    $vuetify.breakpoint.xs
                }"
                class="display-1 my-1 font-weight-bold black--text px-4 text-center"
                style="word-break: break-word"
              >
                {{ branding.landingPage.deviceName }}
              </h3>
              <v-img
                class="my-6"
                src="vendor/device.png"
                alt="brandlogo"
                contain
                max-width="95%"
              />
              <v-col class="specs-chips text-center">
                <v-chip
                  v-for="spec in branding.landingPage.deviceSpecs"
                  :key="spec"
                  :color="
                    branding.themeType === 'dark' ? 'white' : 'grey lighten-2'
                  "
                  :class="{ caption: $vuetify.breakpoint.xs }"
                  class="body-2 black--text ma-1"
                  >{{ spec }}</v-chip
                >
              </v-col>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="apps-page py-12 fill-height">
      <!-- content page 2-->
      <v-container class="app-container">
        <v-row class="text-center" align="center" justify="center">
          <v-col
            :class="{
              'my-5':
                $vuetify.breakpoint.md ||
                $vuetify.breakpoint.lg ||
                $vuetify.breakpoint.xl
            }"
            cols="12"
          >
            <h2
              :class="{
                'display-1': $vuetify.breakpoint.xs,
                'display-2': $vuetify.breakpoint.sm
              }"
              class="display-3 font-weight-bold mb-4"
            >
              Integrate with everything. Within minutes.
            </h2>
            <h3
              :class="{
                headline: $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
              }"
              class="display-1 mb-4"
            >
              Connecting apps has never been easier
            </h3>
          </v-col>

          <AppCards />

          <div class="mt-12 mb-12">
            <p
              :class="{ 'body-2': $vuetify.breakpoint.xs }"
              class="subtitle-1 px-4"
            >
              This IoT connectivity portal is powered by Exosite
              <b>
                Connector-as-a-Service.
              </b>
              Find out more on
              <a :href="this.$userDocLink" target="_blank">
                {{ this.$userDocLink }}
              </a>
              .
            </p>
          </div>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import AppCards from '@/components/applications/AppCards'
export default {
  name: 'LandingPage',
  components: {
    AppCards
  },
  props: {
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imagePaths: {
        brandlogo: 'vendor/brandlogo.png',
        device: 'vendor/device.png'
      }
    }
  }
}
</script>

<style lang="scss">
.landing {
  &__login-btn {
    @media only screen and (max-width: 600px) {
      transform: translateX(6px);
    }
  }
  &__left {
    padding: 16px;
    @media only screen and (min-width: 1000px) {
      transform: translateX(-5%);
    }
    @media only screen and (max-width: 450px) {
      padding: 10px !important;
    }
  }
}
#landing__subtitle-1 {
  @media only screen and (max-width: 450px) {
    font-size: 17px !important;
  }
}
.device-img {
  border-radius: 5px;
  @media only screen and (max-width: 600px) {
    width: 90%;
  }
}

.device-card {
  border-radius: 10px;
  background-color: rgba(white, 0.7);
}

.specs-chips {
  width: 90%;
  @media only screen and (max-width: 400px) {
    width: 95%;
  }
}

.apps-page {
  background-color: rgba(#000, 0.06);
}

.app-container {
  max-width: 1450px !important;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
