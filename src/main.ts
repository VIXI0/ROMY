import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'
import VueTheMask from 'vue-the-mask'


Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.baseURL = "http://localhost:4000/"
const token = localStorage.getItem('token')
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
/*
Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})
*/

Vue.use(VueTheMask)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
