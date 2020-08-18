import Vue from 'vue'
import adminBase from 'admin-base'
import './utils/plugins'
import App from './App.vue'
import router from './router/index'
import '@/assets/global.styl'
import store from '@/store/index';
window.$Bus = new Vue()
Vue.config.productionTip = false

Vue.use(adminBase)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
