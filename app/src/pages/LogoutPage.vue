<template>
  <v-container class="fill-height">
    <v-row class="whitevar--text ml-0" align="center">
      <v-col class="text-center">
        <h1 class="mb-4" :class="$vuetify.breakpoint.xs ? 'headline' : ''">
          You're now signed out
        </h1>
        <p>
          You can go to the
          <router-link
            class="text-underline"
            :to="{ name: 'LandingPage' }"
            data-qa="LandingPageLink"
            >home page</router-link
          >
          or
          <router-link
            class="text-underline"
            :to="{ name: 'LoginPage' }"
            data-qa="LoginPageLink"
            >sign in</router-link
          >
          again.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
