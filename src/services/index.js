import Vue from 'vue'
import { utils } from 'admin-toolkit'
import fetch from './fetch'
import login from './login'
import getMenu from './getMenu'
import * as userConfig from './systemSetting/userConfig'
const service = {
  state: {},
  fetch,
  login,
  getMenu,
  ...userConfig
}
Vue.prototype.$service = utils.wrapService(service)
