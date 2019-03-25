import Vue from 'vue'
import { utils } from 'admin-toolkit'
import fetch from './fetch'
import login from './login'
import getMenu from './getMenu'
import * as userConfig from './systemSetting/userConfig'
import * as roleManage from './systemSetting/roleManage'
import * as departmentManage from './systemSetting/departmentManage'
import * as sysLogOp from './systemSetting/sysLogOp'
import * as blockInfo from './systemSetting/blockInfo'

const service = {
  state: {},
  fetch,
  login,
  getMenu,
  ...userConfig,
  ...roleManage,
  ...departmentManage,
  ...sysLogOp,
  ...blockInfo
}
Vue.prototype.$service = utils.wrapService(service)
