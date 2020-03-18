import fetch from './fetch'
import * as login from './login'
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
import * as panelInfo from './panelInfo'
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
import * as commonResource from './commonResource'
import * as businessTab from './panelManage/businessTab'
import * as mediaResource from './mediaResource'
import * as crowdRel from './crowdRel'
import * as dmp from './dmp'
import * as contentAuth from './contentAuth'
import * as desktop from './desktop'
import * as topic from './topic'
import * as topicConfig from './topicConfig'
import * as mall from './mall'
import * as analytics from './analytics'
import * as tabInsertionTask from './tabInsertionTask'
import * as deviceConfig from './deviceConfig'
import * as policyGroup from './policyGroup'

const service = {
  state: {},
  fetch,
  ...login,
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
  ...common,
  ...commonResource,
  ...businessTab,
  ...mediaResource,
  ...crowdRel,
  ...dmp,
  ...contentAuth,
  ...desktop,
  ...topic,
  ...topicConfig,
  ...mall,
  ...analytics,
  ...tabInsertionTask,
  ...deviceConfig,
  ...policyGroup
}

export default function install (Vue) {
  const $service = {}
  Object.keys(service).forEach((key) => {
    if (typeof service[key] === 'function') {
      $service[key] = async (args, message) => {
        return service[key](args)
          .then((result) => {
            if (message) {
              Vue.prototype.$notify({
                title: '操作成功',
                type: 'success',
                message
              })
            }
            return result
          })
          .catch((error) => {
            if (error.request && error.request.status === 401) {
              location.href = location.origin + location.pathname
            } else {
              Vue.prototype.$notify({
                title: '操作失败',
                type: 'error',
                message: error.message
              })
              return Promise.reject(error)
            }
          })
      }
    } else {
      $service[key] = service[key]
    }
  })
  Vue.prototype.$service = $service
}
