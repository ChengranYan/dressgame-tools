// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from '@/store/'
import VueLazyload from 'vue-lazyload'
import '@/assets/styles/base/border.css'
import '@/assets/styles/base/reset.css'
import 'swiper/dist/css/swiper.css'

Vue.use(VueLazyload, {
  preLoad: 1.4,
  loading: 'src/assets/imgs/loading.gif',
  attempt: 1
})

Vue.config.productionTip = false
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
