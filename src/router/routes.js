import Login from '@/views/Login'

import Wrapper from '@/components/Wrapper.vue'
import BroadcastBlock from '../views/blockInfo/BroadcastBlockIndex'
import MultiFunctionBlock from '../views/blockInfo/MultiFunctionBlockIndex'
import SysPlugin from '../views/blockInfo/SysPluginIndex'
import AlbumPannelInfo from '../views/blockManage/AlbumPannelInfoIndex'
import MarkPanel from '../views/blockManage/MarkPanelIndex'
import PannelInfo from '../views/panelInfo/PannelInfoIndex'
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
import TabInfo from '../views/tabInfo/TabInfoIndex'
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
import Desktop from '@/views/desktop/Desktop'
import FramePage from '../views/FramePage'
import CrowdRel from '../views/crowdRel/Index.vue'

/** */
const children = [
  {
    path: 'commonResource',
    name: 'commonResource',
    component: Wrapper,
    meta: { title: '常用文件', icon: 'el-icon-cc-file' },
    children: [
      {
        name: 'commonTopPannelUser',
        path: '/commonResourceUser/TopPannel/view.html',
        component: undefined,
        meta: {
          title: '常用排行榜',

          tagId: 'commonTopPannelUser'
        }
      },
      {
        name: 'commonPannelUser',
        path: '/commonResourceUser/Pannel/view.html',
        component: CommonPannelUser,
        meta: {
          title: '常用常规运营版块',

          tagId: 'commonPannelUser'
        }
      },
      {
        name: 'commonAlbumPanneleUser',
        path: '/commonResourceUser/AlbumPannel/view.html',
        component: CommonAlbumPanneleUser,
        meta: {
          title: '常用业务专辑',
          tagId: 'commonAlbumPanneleUser'
        }
      }
    ]
  },
  {
    path: 'homePageManage',
    name: 'homePageManage',
    component: Wrapper,
    meta: { title: '首页方案管理', icon: 'el-icon-cc-toufangfangan' },
    children: [
      {
        name: 'homepageInfo',
        path: '/homepageInfo/view.html',
        component: HomePageInfo,
        meta: { title: '首页方案', tagId: 'homepageInfo' }
      },
      {
        name: 'policyConf',
        path: '/policyConf/view.html',
        component: PolicyManage,
        meta: { title: '策略管理', tagId: 'policyConf' }
      },
      {
        name: 'testPolicyConf',
        path: '/testPolicyConf/view.html',
        component: TestPolicyManage,
        meta: {
          title: '测试策略',

          tagId: 'testPolicyConf'
        }
      }
    ]
  },
  {
    path: 'panelManage',
    name: 'panelManage',
    component: Wrapper,
    meta: { title: '版面管理', icon: 'el-icon-cc-banmianguanli-' },
    children: [
      {
        name: 'tabInfo',
        path: '/tabInfo/view.html',
        component: TabInfo,
        meta: { title: 'TAB版面管理', tagId: 'tabInfo' }
      },
      {
        name: 'businessTab',
        path: '/businessTab/view.html',
        component: BusinessTab,
        meta: {
          title: '业务版面',

          tagId: 'businessTab'
        }
      },
      {
        name: 'filmDetailPage',
        path: '/filmDetailPage/view.html',
        component: FilmDetailPage,
        meta: {
          title: '影片详情页',

          tagId: 'filmDetailPage'
        }
      }
    ]
  },
  {
    path: 'blockManage',
    name: 'blockManage',
    component: Wrapper,
    meta: { title: '版块管理', icon: 'el-icon-cc-bankuaiguanli' },
    children: [
      {
        name: 'pannelInfo',
        path: '/pannelInfo/view.html',
        component: PannelInfo,
        meta: { title: '常规运营', tagId: 'pannelInfo' }
      },
      {
        name: 'markPanel',
        path: '/markPanel/view.html',
        component: MarkPanel,
        meta: { title: '功能版块', tagId: 'markPanel' }
      },
      {
        name: 'albumPannelInfo',
        path: '/albumPannelInfo/view.html',
        component: AlbumPannelInfo,
        meta: {
          title: '业务专辑',

          tagId: 'albumPannelInfo'
        }
      },
      {
        name: 'privatePannelInfo',
        path: '/privatePannelInfo/view.html',
        component: PrivatePannelInfo,
        meta: {
          title: '专属影院',

          tagId: 'privatePannelInfo'
        }
      },
      {
        name: 'intelliReccomendPannel',
        path: '/intelliReccomendPannel/view.html',
        component: undefined,
        meta: {
          title: '智能化推荐',
          tagId: 'intelliReccomendPannel'
        }
      }
    ]
  },
  {
    path: 'rotateStation',
    name: 'rotateStation',
    component: Wrapper,
    meta: { title: '轮播管理' },
    children: [
      {
        path: 'rotateStationCategory',
        name: 'rotateStationCategory',
        component: FramePage,
        meta: {
          tagId: 'rotateStationCategory'
        }
      },
      {
        path: 'rotateStationCategory_viewStation',
        name: 'rotateStationCategory_viewStation',
        component: FramePage,
        meta: {
          tagId: 'rotateStationCategory_viewStation'
        }
      },
      {
        path: 'frame-page',
        name: 'rotateTopicInfo',
        component: FramePage,
        meta: {
          tagId: 'rotateTopicInfo'
        }
      }
    ]
  },
  {
    path: 'commonModule',
    name: 'commonModule',
    component: Wrapper,
    meta: { title: '公共模块' },
    children: [
      {
        name: 'layoutInfo',
        path: '/layoutInfo/view.html',
        component: LayoutInfo,
        meta: { title: '布局管理', tagId: 'layoutInfo' }
      },
      {
        name: 'globalPicture',
        path: '/globalPicture/view.html',
        component: GlobalPicture,
        meta: {
          title: '素材管理',
          tagId: 'GlobalPicture'
        }
      },
      {
        name: 'globalCornerIcon',
        path: '/globalCornerIcon/view.html',
        component: GlobalCornerIcon,
        meta: {
          title: '角标素材管理',
          tagId: 'globalCornerIcon'
        }
      },
      {
        name: 'globalCornerIconType',
        path: '/globalCornerIconType/view.html',
        component: GlobalCornerIconType,
        meta: {
          title: '角标分类管理',
          tagId: 'globalCornerIconType'
        }
      },
      {
        name: 'commonOnclickInfo',
        path: '/commonOnclickInfo/view.html',
        component: CommonOnclickInfo,
        meta: {
          title: '点击事件管理',
          tagId: 'commonOnclickInfo'
        }
      }
    ]
  },
  {
    path: 'resourceMgr',
    name: 'resourceMgr',
    component: Wrapper,
    meta: { title: '资源管理', icon: 'el-icon-cc-huaban' },
    children: [
      {
        name: 'videoContent',
        path: '/videoContent/view.html',
        component: VideoContent,
        meta: {
          title: '影片资源库',
          tagId: 'videoContent'
        }
      },
      {
        name: 'videoDataList',
        path: '/videoDataList/view.html',
        component: undefined,
        meta: {
          title: '数据列表',
          tagId: 'videoDataList'
        }
      }
    ]
  },
  {
    path: 'blockInfo',
    name: 'blockInfo',
    component: Wrapper,
    meta: { title: '推荐位管理', icon: 'el-icon-cc-ziyuanguanli' },
    children: [
      {
        name: 'broadcastBlock',
        path: '/broadcastBlock/view.html',
        component: BroadcastBlock,
        meta: {
          title: '轮播推荐位',
          tagId: 'BroadcastBlock'
        }
      },
      {
        name: 'sysPlugin',
        path: '/sysPlugin/view.html',
        component: SysPlugin,
        meta: {
          title: '系统插件(状态栏)',
          tagId: 'SysPlugin'
        }
      },
      {
        name: 'multiFunctionBlock',
        path: '/multiFunctionBlock/view.html',
        component: MultiFunctionBlock,
        meta: {
          title: '多功能推荐位',
          tagId: 'multiFunctionBlock'
        }
      }
    ]
  },
  {
    path: 'videoOnDemand',
    name: 'videoOnDemand',
    component: Wrapper,
    meta: { title: '点播资源管理', icon: 'el-icon-cc-huaban' },
    children: [
      {
        path: 'ownMediaResManage',
        name: 'ownMediaResManage',
        component: FramePage,
        meta: {
          tagId: 'ownMediaResManage'
        }
      },
      {
        path: 'rankingListManage',
        name: 'rankingListManage',
        component: FramePage,
        meta: {
          tagId: 'rankingListManage'
        }
      },
      {
        path: 'ccShortVideoConnectPositiveDetail',
        name: 'ccShortVideoConnectPositiveDetail',
        component: FramePage,
        meta: {
          tagId: 'ccShortVideoConnectPositiveDetail'
        }
      },
      {
        path: 'rightsContentManage',
        name: 'rightsContentManage',
        component: FramePage,
        meta: {
          tagId: 'rightsContentManage'
        }
      }
    ]
  },
  {
    path: 'themeManage',
    name: 'themeManage',
    component: Wrapper,
    meta: { title: '主题管理', icon: 'el-icon-cc-zhuti' },
    children: [
      {
        name: 'themeInfo',
        path: '/themeInfo/view.html',
        component: ThemeInfo,
        meta: {
          title: '主题皮肤管理',
          tagId: 'themeInfo'
        }
      }
    ]
  },
  {
    path: 'dirCrowdManager',
    name: 'dirCrowdManager',
    component: Wrapper,
    meta: { title: '定向人群管理', icon: 'el-icon-cc-institute' },
    children: [
      {
        name: 'actDmpGroupInfo',
        path: '/actDmpGroupInfo/view.html',
        component: ActDmpGroupInfo,
        meta: {
          title: 'RPC人群列表',
          tagId: 'actDmpGroupInfo'
        }
      },
      {
        name: 'dmpMgr',
        path: '/dmpMgr',
        component: CrowdRel,
        meta: {
          tagId: 'dmpMgr'
        }
      }
    ]
  },
  {
    path: 'sysConfig',
    name: 'sysConfig',
    component: Wrapper,
    meta: { title: '系统设置', icon: 'el-icon-cc-renyuanguanli' },
    children: [
      {
        name: 'sysMenu',
        path: '/sysMenu/view.html',
        component: SysMenu,
        meta: { title: '系统菜单', tagId: 'sysMenu' }
      },
      {
        name: 'userConfig',
        path: '/sysUser/view.html',
        component: UserConfig,
        meta: { title: '用户管理', tagId: 'userConfig' }
      },
      {
        name: 'baDept',
        path: '/sysDept/view.html',
        component: DepartmentManage,
        meta: { title: '部门管理', tagId: 'baDept' }
      },
      {
        name: 'sysLogLogin',
        path: '/sysLogLogin/view.html',
        component: SysLogLogin,
        meta: {
          title: '登录日志',
          tagId: 'sysLogLogin'
        }
      },
      {
        name: 'sysLogOp',
        path: '/sysLogOp/view.html',
        component: SysLogOp,
        meta: { title: '操作日志', tagId: 'sysLogOp' }
      },
      {
        name: 'roleConfig',
        path: '/sysRole/view.html',
        component: RoleConfig,
        meta: { title: '角色管理', tagId: 'roleConfig' }
      }
    ]
  },
  {
    path: 'adBitMgr',
    name: 'adBitMgr',
    component: Wrapper,
    meta: { title: '广告位管理', icon: 'el-icon-cc-banner' },
    children: [
      {
        name: 'filmDetailAdBit',
        path: '/filmDetailAdBit/view.html',
        component: FilmDetailAdBit,
        meta: {
          title: '详情页广告位',

          tagId: 'filmDetailAdBit'
        }
      }
    ]
  },
  {
    path: 'todoTask',
    name: 'todoTask',
    component: Wrapper,
    meta: { title: '待处理任务', icon: 'el-icon-cc-daichuli2' },
    children: [
      {
        name: 'myDrafts',
        path: '/myDrafts/view.html',
        component: MyDrafts,
        meta: { title: '我的草稿', tagId: 'myDrafts' }
      },
      {
        name: 'mySubmitTasks',
        path: '/mySubmitTasks/view.html',
        component: MySubmitTasks,
        meta: {
          title: '我提交的任务',
          tagId: 'mySubmitTasks'
        }
      },
      {
        name: 'myReviewTasks',
        path: '/myReviewTasks/view.html',
        component: MyReviewTasks,
        meta: {
          title: '我的审核任务',
          tagId: 'myReviewTasks'
        }
      },
      {
        name: 'msn',
        path: '/v1/msn/view.html',
        component: MovieNotice,
        meta: { title: '下架影片通知', tagId: 'msn' }
      }
    ]
  },
  {
    name: 'desktop',
    path: 'desktop',
    component: Desktop,
    meta: { title: '我的桌面', tagId: 'desktop' }
  }
]
/**/

const routes = [
  {
    path: '/',
    component: Main,
    redirect: '/desktop',
    children
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
]

export default routes
