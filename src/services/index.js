import Vue from 'vue'
import { utils } from 'admin-toolkit'
import fetch from './fetch'
import login from './login'
import getMenu from './getMenu'
import upload from './upload'
import * as userConfig from './systemSetting/userConfig'
import * as roleManage from './systemSetting/roleManage'
import * as departmentManage from './systemSetting/departmentManage'
import * as sysLogOp from './systemSetting/sysLogOp'
import * as blockInfo from './systemSetting/blockInfo'
import * as materialManage from './commonModule/materialManage'
import * as tabInfo from './panelManage/tabInfo'
import * as panelInfo from './blockManage/panelInfo'
import * as homePageInfo from './homePageManage/homePageInfo'
const service = {
  state: {},
  fetch,
  login,
  getMenu,
  upload,
  ...userConfig,
  ...roleManage,
  ...departmentManage,
  ...sysLogOp,
  ...blockInfo,
  ...materialManage,
  ...tabInfo,
  ...panelInfo,
  ...homePageInfo
}
Vue.prototype.$service = utils.wrapService(service)
