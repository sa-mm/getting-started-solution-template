<template>
  <div>
    <v-container class="app-container">
      <v-row class="text-center" align="center" justify="center">
        <v-col v-for="app in apps" :key="app.name" cols="12" sm="6" md="3">
          <div class="app-card elevation-4 py-5 border-radius-1">
            <h3 class="headline">{{ app.name }}</h3>
            <img :src="app.img" class="mx-auto my-4 app-card__img" />
            <div>
              <p class="mb-0">{{ app.description }}</p>
            </div>
            <div class="mt-2">
              <a :href="app.link" target="_blank">
                <v-btn outlined color="primary" class="text-none"
                  >Get Started</v-btn
                >
              </a>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AppCards',
  data() {
    return {
      apps: [
        {
          name: 'Exosense',
          img: 'static/apps/exosense.png',
          description: 'Get your Industrial Monitoring.',
          link: `${this.$userDocLink}#exosense`
        },
        {
          name: 'Murano',
          img: 'static/apps/murano.png',
          description: 'Build your Murano IoT application.',
          link: `${this.$userDocLink}murano-app/`
        },
        {
          name: 'AWS',
          img: 'static/apps/aws.png',
          description: 'AWS application integration.',
          link: `${this.$userDocLink}aws-lambda-es/`
        },
        {
          name: 'Others',
          img: 'static/apps/other.png',
          description: 'Connect from anywhere in few steps.',
          link: `${this.$userDocLink}#external-application`
        }
        // {
        //   name: 'Microsoft Azure',
        //   img: 'static/apps/azure.png',
        //   specs: ['Blazing fast', '$25/month', 'Convenience'],
        //   link: 'https://azure.microsoft.com/'
        // }
      ]
    }
  }
}
</script>

<style lang="scss">
.app-card {
  background-color: #eee;
  &__img {
    background: white;
    object-fit: contain;
    height: 160px;
    width: 100%;
  }
}
</style>
