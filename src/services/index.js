import Vue from 'vue'
import { utils } from 'admin-toolkit'
import fetch from './fetch'
import login from './login'
import * as getMenu from './getMenu'
import * as upload from './upload'
import * as userConfig from './systemSetting/userConfig'
import * as roleManage from './systemSetting/roleManage'
import * as departmentManage from './systemSetting/departmentManage'
import * as sysLogOp from './systemSetting/sysLogOp'
import * as blockInfo from './blockInfo'
import * as adminMasterControll from './systemSetting/adminMasterControll'
import * as materialManage from './commonModule/materialManage'
import * as tabInfo from './tabInfo'
import * as panelInfo from './blockManage/panelInfo'
import * as homePageInfo from './homePageManage/homePageInfo'
import * as resourceManage from './resourceManage/movie'
import * as markPanel from './blockManage/markPanel'
import * as globalCornerIconType from './commonModule/globalCornerIconType'
import * as layoutInfor from './commonModule/layoutInfor'
import * as themeInfo from './themeManage/themeInfo'
import * as globalPicture from './commonModule/globalPicture'
import * as globalCornerIconMgr from './commonModule/globalCornerIconMgr'
import * as advertisement from './advertisement'
import * as privatePannel from './blockManage/privatePannel'
import * as todoTask from './todoTask'
import * as policyManage from './homePageManage/policyManage'
import * as sysPlugin from './sysPlugin'
import * as common from './common'

const service = {
  state: {},
  fetch,
  login,
  ...getMenu,
  ...advertisement,
  ...upload,
  ...userConfig,
  ...roleManage,
  ...departmentManage,
  ...sysLogOp,
  ...blockInfo,
  ...materialManage,
  ...tabInfo,
  ...panelInfo,
  ...homePageInfo,
  ...resourceManage,
  ...markPanel,
  ...globalCornerIconType,
  ...layoutInfor,
  ...themeInfo,
  ...globalPicture,
  ...globalCornerIconMgr,
  ...adminMasterControll,
  ...privatePannel,
  ...todoTask,
  ...policyManage,
  ...sysPlugin,
  ...common
}
Vue.prototype.$service = utils.wrapService(service)
