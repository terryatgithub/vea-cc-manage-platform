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
import * as adminMasterControll from './systemSetting/adminMasterControll'
import * as materialManage from './commonModule/materialManage'
import * as globalCornerIconType from './commonModule/globalCornerIconType'
import * as layoutInfor from './commonModule/layoutInfor'
import * as globalPicture from './commonModule/globalPicture'
import * as advertisement from './advertisement'

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
  ...globalCornerIconType,
  ...adminMasterControll,
  ...layoutInfor,
  ...globalPicture,
  ...advertisement,
  ...adminMasterControll
}
Vue.prototype.$service = utils.wrapService(service)
