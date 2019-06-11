import Vue from 'vue'

import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import service from '../services'

import 'element-ui/lib/theme-chalk/index.css'
// import './theme/coocaa-red/index.css'
import './bus'
import shadowDrag from '@/directives/shadowDrag'

import AppState from '@william17/vue-app-state'

import 'admin-toolkit/dist/admin-toolkit.css'
import { GateSchemaForm } from 'admin-toolkit'

import '@/assets/icon/iconfont.css'

import './auth'
import './common'
import constants from './consts'
import ContentCard from './../components/ContentCard.vue'
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
// Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 }

Vue.use(VCharts)
Vue.use(ElementUI)
Vue.use(AppState)
Vue.use(service)
Vue.component('GateSchemaForm', GateSchemaForm)
Vue.component('ContentCard', ContentCard)
Vue.directive('shadow-drag', shadowDrag)
Vue.prototype.$consts = constants
