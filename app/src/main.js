import App from './App.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import axios from '@/api/axios'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

import StandardDialog from '@/components/shared/StandardDialog'
import filters from './misc/filters'

Vue.filter('truncateText', filters.truncateText)
Vue.use(Vuetify)
Vue.component('StandardDialog', StandardDialog)
Vue.config.productionTip = false
// Global variables
Vue.prototype.$docLink = 'https://docs.exosite.com/connectivity/pdaas'
Vue.prototype.$userDocLink = `${Vue.prototype.$docLink}/device-owner/`

const vuetify = new Vuetify({
  options: {
    customProperties: true
  },
  icons: {
    iconfont: 'md'
  },
  theme: {
    options: {
      customProperties: true
    }
  }
})

new Vue({
  el: '#app',
  vuetify,
  router,
  components: { App },
  data: function() {
    return {
      branding: {},
      brandingStatus: 'loading',
      error: ''
    }
  },
  mounted() {
    this.loadBranding()
  },
  methods: {
    async loadBranding() {
      try {
        const { data } = await axios.get('/vendor/branding.json')

        if (typeof data !== 'object') {
          throw new Error('unable to load JSON file')
        }
        this.applyBranding(data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err)
        this.brandingStatus = 'error'
      }
    },
    applyBranding(data) {
      const brandingData = data
      const { theme = {} } = brandingData
      const optionLinksDefaults = {
        helpApp: `${this.$userDocLink}#managing-applications`,
        helpDevice: `${this.$userDocLink}#managing-devices`
      }
      brandingData.links = {
        ...optionLinksDefaults,
        ...brandingData.links
      }

      Object.assign(this.branding, brandingData)
      Object.assign(this.$vuetify.theme.themes.light, {
        ...theme,
        whitevar: data.themeType === 'light' ? '#000' : '#fff'
      })
      this.brandingStatus = 'applied'
    }
  },
  template: '<App :branding="branding" :brandingStatus="brandingStatus" />'
})
