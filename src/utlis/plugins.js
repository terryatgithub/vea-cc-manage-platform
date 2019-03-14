import Vue from 'vue'

import ElementUI from 'element-ui'
import VCharts from 'v-charts'

import 'element-ui/lib/theme-chalk/index.css'
// import './theme/coocaa-red/index.css'
import './bus'

import AppState from '@william17/vue-app-state'

import 'admin-toolkit/dist/admin-toolkit.css'
import { GateSchemaForm } from 'admin-toolkit'

import '@/assets/icon/iconfont.css'

import './auth'
import ContentCard from './../components/ContentCard.vue'
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
// Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 }

Vue.use(VCharts)
Vue.use(ElementUI)
Vue.use(AppState)
Vue.component('GateSchemaForm', GateSchemaForm)
Vue.component('ContentCard', ContentCard)
