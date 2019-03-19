import Vue from 'vue'
import { utils } from 'admin-toolkit'
import fetch from './fetch'
import login from './login'
import getMenu from './getMenu'
import * as userConfig from './systemSetting/userConfig'
import * as roleManage from './systemSetting/roleManage'
const service = {
  state: {},
  fetch,
  login,
  getMenu,
  ...userConfig,
  ...roleManage
}
Vue.prototype.$service = utils.wrapService(service)
