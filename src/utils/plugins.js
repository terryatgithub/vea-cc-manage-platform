import Vue from 'vue'

import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import service from '../services'

import 'element-ui/lib/theme-chalk/index.css'
// import './theme/coocaa-red/index.css'
import './bus'
import shadowDrag from '@/directives/shadowDrag'
import inputConfirm from '@/directives/input-confirm'
import FormAutoComplete from '@/utils/FormAutoComplete'

import AppState from '@william17/vue-app-state'

import 'admin-toolkit/dist/admin-toolkit.css'
import { GateSchemaForm, DataForm,
  Boolean as DataBoolean,
  String as DataString,
  Number as DataNumber,
  Enum as DataEnum,
  EnumList as DataEnumList,
  Any as DataAny } from 'admin-toolkit'

import '@/assets/icon/iconfont.css'

import './auth'
import './common'
import './analytics'
import constants from './consts'
import ContentCard from './../components/ContentCard.vue'
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
// Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 }

Vue.use(VCharts)
Vue.use(ElementUI)
Vue.use(AppState)
Vue.use(service)
Vue.use(FormAutoComplete)
Vue.component('GateSchemaForm', GateSchemaForm)
Vue.component('ContentCard', ContentCard)

Vue.component('DataForm', DataForm)
Vue.component('DataBoolean', DataBoolean)
Vue.component('DataString', DataString)
Vue.component('DataNumber', DataNumber)
Vue.component('DataEnum', DataEnum)
Vue.component('DataEnumList', DataEnumList)
Vue.component('DataAny', DataAny)

Vue.directive('shadow-drag', shadowDrag)
Vue.directive('input-confirm', inputConfirm)
Vue.prototype.$consts = constants
