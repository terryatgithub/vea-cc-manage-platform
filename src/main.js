import Vue from 'vue'
import './utlis/plugins'
import App from './App.vue'
import router from './router/index'
import './services'
import '@/assets/global.styl'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
