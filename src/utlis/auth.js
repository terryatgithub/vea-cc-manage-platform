import Vue from 'vue'
import Wrapper from '@/components/Wrapper.vue'
import BroadcastBlock from '../views/blockInfo/BroadcastBlockIndex'
import MultiFunctionBlock from '../views/blockInfo/MultiFunctionBlockIndex'
import SysPlugin from '../views/blockInfo/SysPluginIndex'
import AlbumPannelInfo from '../views/blockManage/AlbumPannelInfoIndex'
import MarkPanel from '../views/blockManage/MarkPanelIndex'
import PannelInfo from '../views/blockManage/PannelInfoIndex'
import PrivatePannelInfo from '../views/blockManage/PrivatePannelInfoIndex'
import CommonOnclickInfo from '../views/commonModule/CommonOnclickInfoIndex'
import GlobalCornerIcon from '../views/commonModule/GlobalCornerIconIndex'
import GlobalCornerIconType from '../views/commonModule/GlobalCornerIconTypeIndex'
import GlobalPicture from '../views/commonModule/GlobalPictureIndex'
import LayoutInfo from '../views/commonModule/LayoutInfoIndex'
import CommonAlbumPanneleUser from '../views/commonResource/CommonAlbumPanneleUserIndex'
import CommonPannelUser from '../views/commonResource/CommonPannelUserIndex'
import CommonTabUser from '../views/commonResource/CommonTabUserIndex'
import DataSync from '../views/dataSyncMgr/DataSyncIndex'
import SlaveBizErrLog from '../views/dataSyncMgr/SlaveBizErrLogIndex'
import SlaveSecondAudit from '../views/dataSyncMgr/SlaveSecondAuditIndex'
import ActDmpGroupInfo from '../views/dirCrowdManager/ActDmpGroupInfoIndex'
import HomePageInfo from '../views/homePageManage/HomePageInfoIndex'
import PolicyManage from '../views/homePageManage/PolicyManageIndex'
import TestPolicyManage from '../views/homePageManage/TestPolicyManageIndex'
import BusinessTab from '../views/panelManage/BusinessTabIndex'
import FilmDetailPage from '../views/panelManage/FilmDetailPageIndex'
import TabInfo from '../views/panelManage/TabInfoIndex'
import VideoContent from '../views/resourceManage/VideoContentIndex'
import AdminMasterControl from '../views/sysConfig/AdminMasterControlIndex'
import DataDictionary from '../views/sysConfig/DataDictionaryIndex'
import DepartmentManage from '../views/sysConfig/DepartmentManageIndex'
import RoleConfig from '../views/sysConfig/RoleConfigIndex'
import SysLogLogin from '../views/sysConfig/SysLogLoginIndex'
import SysLogOp from '../views/sysConfig/SysLogOpIndex'
import SysMenu from '../views/sysConfig/SysMenuIndex'
import UserConfig from '../views/sysConfig/UserConfigIndex'
import ThemeInfo from '../views/themeManage/ThemeInfoIndex'
import MovieNotice from '../views/todoTask/MovieNoticeIndex'
import MyDrafts from '../views/todoTask/MyDraftsIndex'
import MyReviewTasks from '../views/todoTask/MyReviewTasksIndex'
import MySubmitTasks from '../views/todoTask/MySubmitTasksIndex'
import FilmDetailAdBit from '../views/adBitMgr/FilmDetailAdBit.vue'
import Main from '@/components/Main'
const routerMap = {
  broadcastBlock: BroadcastBlock,
  multiFunctionBlock: MultiFunctionBlock,
  sysPlugin: SysPlugin,
  albumPannelInfo: AlbumPannelInfo,
  markPanel: MarkPanel,
  pannelInfo: PannelInfo,
  privatePannelInfo: PrivatePannelInfo,
  commonOnclickInfo: CommonOnclickInfo,
  globalCornerIcon: GlobalCornerIcon,
  globalCornerIconType: GlobalCornerIconType,
  globalPicture: GlobalPicture,
  layoutInfo: LayoutInfo,
  commonAlbumPanneleUser: CommonAlbumPanneleUser,
  commonPannelUser: CommonPannelUser,
  commonTabUser: CommonTabUser,
  dataSync: DataSync,
  slaveBizErrLog: SlaveBizErrLog,
  slaveSecondAudit: SlaveSecondAudit,
  actDmpGroupInfo: ActDmpGroupInfo,
  homepageInfo: HomePageInfo,
  policyConf: PolicyManage,
  testPolicyConf: TestPolicyManage,
  businessTab: BusinessTab,
  filmDetailPage: FilmDetailPage,
  tabInfo: TabInfo,
  videoContent: VideoContent,
  adminMasterControl: AdminMasterControl,
  dict: DataDictionary,
  baDept: DepartmentManage,
  roleConfig: RoleConfig,
  sysLogLogin: SysLogLogin,
  sysLogOp: SysLogOp,
  sysMenu: SysMenu,
  userConfig: UserConfig,
  themeInfo: ThemeInfo,
  msn: MovieNotice,
  myDrafts: MyDrafts,
  myReviewTasks: MyReviewTasks,
  mySubmitTasks: MySubmitTasks,
  filmDetailAdBit: FilmDetailAdBit
}
function getInitData (app) {
  return app.$service.getMenu().then(data => {
    if (data.length === 0) {
      app.$router.push({
        name: 'login',
        query: { redirect: app.$route.fullPath }
      })
    }
    let children = []
    data.forEach(element => {
      let obj = {}
      obj.name = obj.path = element.id
      obj.component = Wrapper
      obj.meta = {
        title: element.title,
        icon: element.icon
      }
      obj.children = []
      if (typeof element.children !== 'undefined') {
        element.children.forEach(elementC => {
          obj.children.push({
            name: elementC.id,
            path: elementC.attributes.iframeUrl,
            component: routerMap[elementC.id],
            meta: {
              title: elementC.text,
              icon: elementC.iconCls,
              tagId: elementC.id
            }
          })
        })
      }
      children.push(obj)
    })
    let filterRoutes = []
    filterRoutes.push({
      path: '/',
      component: Main,
      children
    })
    app.$router.options.routes = filterRoutes // 动态路由
    app.$router.addRoutes(filterRoutes) // 动态路由
  })
}
Vue.prototype.$isLoggedIn = async function () {
  const $appState = this.$appState
  // memory
  if ($appState.user) {
    return
  }
  // storage
  const user = $appState.$get('user')
  if (user) {
    //
    this.$service.service.state = user
    return getInitData(this).then(res => {
      this.$appState.user = user
      // this.$appState.permissions={};
      // res.permissions.forEach((item)=>{
      //     this.$appState.permissions[item]=item;
      // })
      // this.$appState.menus=res.menus;
    })
  }
  throw {}
}
Vue.prototype.$login = async function (data) {
  return this.$service.login(data).then(res => {
    const user = {
      name: data.username,
      //   token: res.jwtToken,
      password: data.password
    }
    this.$service.service.state = user
    this.$appState.user = user
    this.$appState.$set('user', user)
    return getInitData(this).then(res => {})
    // this.$appState.menus=res.menus;
    // this.$appState.permissions={};
    // res.permissions.forEach((item)=>{
    //     this.$appState.permissions[item]=item;
    // })
  })
}

Vue.prototype.$logout = async function () {
  this.$appState.user = undefined
  this.$appState.$remove('user')
}
