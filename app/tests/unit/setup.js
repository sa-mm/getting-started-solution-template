import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
//supress 2 log warning , difficult to resolve : infinite loop warning from DevicesPage.page, and Apiwrapper ECONNREFUSED with TcpConnectwrap. 
Vue.config.silent = true;
// The following is a workaround that fixes warnings that look like:
// [Vuetify] Unable to locate target [data-app] in "v-menu"
const app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.appendChild(app)

// to avoid vue-qrcode-reader library's jsdom error
// https://github.com/jsdom/jsdom/issues/1782
window.HTMLCanvasElement.prototype.getContext = jest.fn()
