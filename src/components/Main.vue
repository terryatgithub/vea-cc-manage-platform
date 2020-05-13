<template>
  <el-container class="layout">
    <div :class="isCollapseMenu? 'aside__menu aside__menu_collapse' : 'aside__menu'">
      <el-button
        class="collpase-btn"
        type="text"
        :icon="isCollapseMenu? 'el-icon-cc-indent' : 'el-icon-cc-outdent'"
        @click="toggleMenu"
      ></el-button>
      <div class="left-aside">
        <Menu
          @select="handleOpenMenu"
          :default-active="$route.name"
          :items="menu"
          :isCollapse="isCollapseMenu"
        ></Menu>
      </div>
    </div>
    <el-container direction="vertical">
      <el-header class="header">
        <div class="logo" direction="vertical">
          <div class="logo__img">
            <i class="el-icon-location"></i>
            {{ companyMap[$consts.idPrefix] }}内容运营平台
          </div>
        </div>
        <span role="presentation" class="el-breadcrumb__separator">/</span>
        <Breadcrumb class="breadcrumb" :items="breadcrumb" />
        <div class="user-info">
          <a href="http://wiki.skyoss.com/pages/viewpage.action?pageId=33481206" target="_blank">
            <el-button type="danger" style="margin-right: 10px;">不好用，我要反馈</el-button>
          </a>
          <el-dropdown :hide-on-click="false" @command="handleDropdownCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-cc-user"></i>
              {{ $appState.user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="modifyPassword" @click.native="modifyPwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <div class="system-setting" @click="isShowSetting = !isShowSetting">
          <i class="el-icon-setting"></i>
        </div>-->
      </el-header>
      <TagNav
        ref="tag"
        default-path="/desktop"
        @navigate="handleNavigate"
        :titles="titles"
        :init-tags="initTags"
        v-show="isShowTagNav"
        class="tagNav"
      />
      <!-- safari 兼容性问题 -->
      <el-main class="main-content" ref="main">
        <keep-alive>
          <router-view v-if="isKeepAlive" />
        </keep-alive>
        <router-view v-if="!isKeepAlive" />
      </el-main>
    </el-container>
    <!-- <transition name="el-zoom-in-right">
      <div class="setting_side transition-box" v-show="isShowSetting">
        <div class="tagnav_switch">
          标签导航
          <el-switch v-model="isShowTagNav" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          <br>
          <el-button type="primary" class="modifyPwd" @click="modifyPwd">修改密码</el-button>
        </div>
      </div>
    </transition>-->
    <!-- 修改密码-->
    <el-dialog title="修改密码" :visible.sync="modifyDialogVisible">
      <span>
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="旧密码" prop="oldpwd">
            <el-input type="password" v-model="form.oldpwd" placeholder="旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpwd">
            <el-input type="password" v-model="form.newpwd" placeholder="新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newpwd2">
            <el-input type="password" v-model="form.newpwd2" placeholder="确认密码"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPwdSave">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end -->
  </el-container>
</template>
<script>
import { Breadcrumb, TagNav } from 'admin-toolkit'
import Menu from './Menu'

// 菜单 name 到 路由 name 之间到映射
const routerMap = {
  // 轮播管理
  rotateStationCategory: 'rotateStationCategory',
  rotateStationCategory_viewStation: 'rotateStationCategory_viewStation',
  rotateTopicInfo: 'rotateTopicInfo',

  // 点播资源管理
  ownMediaResManage: 'ownMediaResManage',
  rankingListManage: 'rankingListManage',
  ccShortVideoConnectPositiveDetail: 'ccShortVideoConnectPositiveDetail',
  rightsContentManage: 'rightsContentManage',
  // 推荐位管理
  broadcastBlock: 'broadcastBlock',
  multiFunctionBlock: 'multiFunctionBlock',
  sysPlugin: 'sysPlugin',
  mediaAutomation: 'mediaAutomation',
  newRecommendStream: 'newRecommendStream',

  albumPannelInfo: 'albumPannelInfo',
  markPanel: 'markPanel',
  pannelInfo: 'pannelInfo',
  ruleCreatePanel: 'ruleCreatePanel',
  privatePannelInfo: 'privatePannelInfo',
  commonOnclickInfo: 'commonOnclickInfo',
  globalCornerIcon: 'globalCornerIcon',
  globalCornerIconType: 'globalCornerIconType',
  globalPicture: 'globalPicture',
  layoutInfo: 'layoutInfo',
  commonAlbumPanneleUser: 'commonAlbumPanneleUser',
  commonPannelUser: 'commonPannelUser',
  commonTabUser: 'commonTabUser',
  dataSync: 'dataSync',
  slaveBizErrLog: 'slaveBizErrLog',
  slaveSecondAudit: 'slaveSecondAudit',
  actDmpGroupInfo: 'actDmpGroupInfo',
  homepageInfo: 'homepageInfo',
  policyConf: 'policyConf',
  testPolicyConf: 'testPolicyConf',
  businessTab: 'businessTab',
  filmDetailPage: 'filmDetailPage',
  tabInfo: 'tabInfo',
  videoContent: 'videoContent',
  adminMasterControl: 'adminMasterControl',
  dict: 'dataDictionary',
  baDept: 'baDept',
  roleConfig: 'roleConfig',
  sysLogLogin: 'sysLogLogin',
  sysLogOp: 'sysLogOp',
  sysMenu: 'sysMenu',
  userConfig: 'userConfig',
  themeInfo: 'themeInfo',
  msn: 'msn',
  myDrafts: 'myDrafts',
  myReviewTasks: 'myReviewTasks',
  mySubmitTasks: 'mySubmitTasks',
  filmDetailAdBit: 'filmDetailAdBit',
  dmpMgr: 'dmpMgr',
  // 短视频
  topic: 'topic',
  topicConfig: 'topicConfig',

  // 版块推荐
  panelRecommend: 'panelRecommend',

  // 版面强插
  tabForceInsert: 'tabForceInsert',
  panelRecommendCoreData: 'panelRecommendCoreData',
  panelRecommendFeedback: 'panelRecommendFeedback',
  // 儿童策略
  childPolicy: 'childPolicy',

  deviceConfig: 'deviceConfig',

  testPolicyGroup: 'testPolicyGroup',
  policyGroup: 'policyGroup',
  matchHomepage: 'matchHomepage'
}

const iconMap = {
  // 轮播管理
  rotateStation: 'el-icon-cc-interation',
  rotateStationCategory: 'el-icon-cc-right-square',
  rotateStationCategory_viewStation: 'el-icon-cc-down-square',
  rotateTopicInfo: 'el-icon-cc-down-square',

  // 点播资源管理
  ownMediaResManage: 'el-icon-cc-fund',
  rankingListManage: 'el-icon-cc-fund',
  ccShortVideoConnectPositiveDetail: 'el-icon-cc-fund',
  rightsContentManage: 'el-icon-cc-fund',

  // 推荐位管理
  broadcastBlock: 'el-icon-cc-gold',
  multiFunctionBlock: 'el-icon-cc-control',
  sysPlugin: 'el-icon-cc-minus-square',
  mediaAutomation: 'el-icon-cc-tag',
  newRecommendStream: 'el-icon-cc-tag',
  ruleCreatePanel: 'el-icon-cc-bankuaiguanli',

  blockInfo: 'el-icon-cc-appstore',
  blockManage: 'el-icon-cc-border',
  albumPannelInfo: 'el-icon-cc-block',
  markPanel: 'el-icon-cc-table',
  pannelInfo: 'el-icon-cc-block',
  privatePannelInfo: 'el-icon-cc-gateway',

  videoOnDemand: 'el-icon-cc-tablet',

  commonModule: 'el-icon-cc-cloud',
  commonOnclickInfo: 'el-icon-cc-attachment',
  globalCornerIcon: 'el-icon-cc-image',
  globalCornerIconType: 'el-icon-cc-fund',
  globalPicture: 'el-icon-cc-file-image',
  layoutInfo: 'el-icon-cc-build',

  commonResource: 'el-icon-cc-star',
  commonAlbumPanneleUser: 'commonAlbumPanneleUser',
  commonPannelUser: 'commonPannelUser',
  commonTabUser: 'commonTabUser',

  slaveBizErrLog: 'slaveBizErrLog',
  slaveSecondAudit: 'slaveSecondAudit',
  actDmpGroupInfo: 'actDmpGroupInfo',

  homePageManage: 'el-icon-cc-bank',
  homepageInfo: 'el-icon-cc-home',
  policyConf: 'el-icon-cc-fork',
  testPolicyConf: 'el-icon-cc-branches',

  panelManage: 'el-icon-cc-layout',
  tabInfo: 'el-icon-cc-pic-center',
  businessTab: 'el-icon-cc-pic-right',
  filmDetailPage: 'el-icon-cc-pic-left',

  resourceMgr: 'el-icon-cc-folder-open',
  videoContent: 'el-icon-cc-video',
  videoDataList: 'el-icon-cc-file-copy',

  dataSyncMgr: 'el-icon-cc-sync',

  sysConfig: 'el-icon-cc-setting',
  adminMasterControl: 'adminMasterControl',
  dict: 'dataDictionary',
  baDept: 'baDept',
  roleConfig: 'roleConfig',
  sysLogLogin: 'sysLogLogin',
  sysLogOp: 'sysLogOp',
  sysMenu: 'sysMenu',
  userConfig: 'userConfig',

  themeManage: 'el-icon-cc-font-colors',
  themeInfo: 'el-icon-cc-font-size',

  msn: 'el-icon-cc-database',
  todoTask: 'el-icon-cc-edit-square',
  myDrafts: 'el-icon-cc-database',
  myReviewTasks: 'el-icon-cc-database',
  mySubmitTasks: 'el-icon-cc-database',

  adBitMgr: 'el-icon-cc-banner',
  filmDetailAdBit: 'el-icon-cc-calendar-check',

  dirCrowdManager: 'el-icon-cc-team',

  // 短视频
  svMgr: 'el-icon-cc-play-square',
  topic: 'el-icon-cc-message',
  topicConfig: 'el-icon-cc-notification',

  // 版块推荐
  panelRecommend: 'el-icon-cc-border-outer',

  // 版面强插
  tabForceInsert: 'el-icon-sell',

  // 版面个性化推荐核心指标
  panelRecommendCoreData: 'el-icon-data-line',
  // 版块个性化推荐反馈
  panelRecommendFeedback: 'el-icon-message',

  childPolicy: 'el-icon-s-check',
  homeConfig: 'el-icon-setting',
  deviceConfig: 'el-icon-s-tools',

  policyGroup: 'el-icon-cc-fork',
  testPolicyGroup: 'el-icon-cc-branches',
  matchHomepage: 'el-icon-cc-pic-center',

  recommendStream: 'el-icon-connection'
}

export default {
  components: {
    Menu,
    Breadcrumb,
    TagNav
  },
  // props: ['menu'],
  data () {
    return {
      menu: [],
      titles: {},
      breadcrumb: [],
      isCollapseMenu: false,
      isShowSetting: false,
      isShowTagNav: true,
      modifyDialogVisible: false,
      companyMap: {
        '10': '酷开',
        '11': '江苏有线'
      },
      // initTags: [],
      form: {
        oldpwd: null,
        newpwd: null,
        newpwd2: null
      },
      formRules: {
        oldpwd: [
          { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        newpwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newpwd2: [
          { required: true, validator: this.validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isKeepAlive () {
      const meta = this.$route.meta
      return meta && meta.isCache !== false
    },
    initTags () {
      const tags =
        this.$appState.$get('tags' + '_' + this.$appState.user.name) || []
      if (tags.length === 0) {
        tags.push({
          fullPath: '/desktop',
          meta: {
            title: '我的桌面',
            tagId: 'desktop'
          },
          name: 'desktop',
          isCloseable: false
        })
      }
      return tags
    },
    defaultMenu () {
      const mainRoute = this.$router.options.routes.find(item => {
        return item.path === '/'
      })
      mainRoute.children.pop()
      function gen ({ name, meta = {}, children }) {
        if (!meta.hideInMenu) {
          const currentMenuItem = {
            title: meta.title,
            icon: meta.icon,
            route: name
          }
          if (children) {
            currentMenuItem.children = children.reduce((result, item) => {
              const menuItem = gen(item)
              if (menuItem) {
                result.push(menuItem)
              }
              return result
            }, [])
          }
          return currentMenuItem
        }
      }
      const items = gen(mainRoute).children
      console.log('defaultMenu:', items)
      return items
    }
  },
  methods: {
    handleOpenMenu (name, menu) {
      this.$router.push({
        name: routerMap[name],
        query: menu.query,
        params: menu.params
      })
    },
    modifyPwd () {
      this.modifyDialogVisible = true
    },
    modifyPwdSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { oldpwd, newpwd } = this.form
          if (oldpwd === newpwd) {
            return this.$message.error('新密码和旧密码不能一样')
          }
          this.$service.modifyPwd(this.form, '修改成功').then(data => {
            this.modifyDialogVisible = false
            this.$logout().then(() => {
              this.$router.push({ name: 'login' })
            })
          })
        }
      })
    },
    validatePass2 (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newpwd) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    },
    handleDropdownCommand (command) {
      if (command === 'logout') {
        this.$logout().then(() => {
          this.$router.push({ name: 'login' })
        })
      }
    },
    toggleMenu () {
      const isCollapseMenu = !this.isCollapseMenu
      this.$appState.$set('isCollapseMenu', isCollapseMenu)
      this.isCollapseMenu = isCollapseMenu
    },
    saveTags () {
      const tags = this.$refs.tag.tags
      this.$appState.$set('tags' + '_' + this.$appState.user.name, tags)
    },
    getMenu () {
      this.$service.getMenu().then(menu => {
        const titles = {}
        const parseMenu = menu => {
          if (Array.isArray(menu)) {
            return menu.map(parseMenu)
          }
          titles[menu.id] = menu.text
          const item = {
            icon: iconMap[menu.id],
            route: menu.id,
            title: menu.text
          }
          const attr = menu.attributes
          if (attr && attr.modle === '3') {
            // 如果是外部的链接
            item.openType = attr.iframeUrl
            item.query = {
              url: attr.iframeUrl
            }
          }
          const children = menu.children
          if (children && children.length > 0) {
            item.children = parseMenu(children)
          }
          return item
        }
        this.menu = parseMenu(menu)
        this.titles = titles
        this.scrollMenuIntoView()
      })
    },
    handleNavigate (route) {
      this.$sendEvent({
        type: 'menu_click',
        payload: {
          menu_name: this.titles[route.name]
        }
      })
      this.scrollMenuIntoView()
    },
    scrollMenuIntoView () {
      setTimeout(() => {
        const $activeSubMenu = document.querySelector('.el-submenu.is-active')
        const $activeMenu = document.querySelector('.el-menu-item.is-active')
        if ($activeMenu) {
          $activeMenu.scrollIntoViewIfNeeded()
        }
        if ($activeSubMenu) {
          $activeSubMenu.scrollIntoViewIfNeeded()
        }
      }, 1000)
    }
  },
  created () {
    this.isCollapseMenu = !!this.$appState.$get('isCollapseMenu')
    this.$bus.$on('breadcrumb-change', breadcrumb => {
      this.breadcrumb = breadcrumb
    })
    this.getMenu()
  },
  mounted () {
    this.$bus.$on('scroll-top', () => {
      if (this.$refs.main) {
        this.$refs.main.$el.scrollTo(0, 0)
      }
    })

    //  this.saveTags()
    window.addEventListener('beforeunload', this.saveTags)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.saveTags)
  }
}
</script>

<style lang="stylus">
.collpase-btn {
  &, &:hover, &:focus {
    color: #606266;
  }
}

.collpase-btn {
  width: 100%;
  background: #fc4c02;
  border-radius: 0;
  padding: 14px 20px;
}

.collpase-btn i {
  font-size: 20px;
  color: #fff;
}

.collpase-btn:hover, .collpase-btn:focus {
  color: #fff;
  background: #e44907;
}

.user-info {
  margin-left: auto;
  margin-right: 15px;
  cursor: pointer;
}

.menu:not(.el-menu--collapse)
  width 200px
  background #333
.menu li
  position relative
.el-submenu__title
  color #fff
.el-menu-item.is-active
  color #fff
  background #000
  &:before
    width 3px
    background #eb603a
    content ' '
    display block
    position absolute
    left 0
    top 0
    height 100%
    transition background-color 1s ease
.el-menu-item
  color #fff
.el-menu-item, .el-submenu__title
  height 45px
  line-height 45px
.el-submenu .el-menu-item
  height 40px
  line-height 40px
.el-menu
  background #333
.el-submenu__title:hover,.el-menu-item:hover
  background:#4c4c4c
.el-submenu.is-opened .el-submenu__title
  background #2d2d2d
.el-submenu .el-menu
  background #1e1e1e
.aside__menu_collapse .el-submenu.is-active
  background #1e1e1e
.aside__menu_collapse .el-submenu.is-active:before
  width 3px
  background #eb603a
  content ' '
  display block
  position absolute
  left 0
  top 0
  height 100%
  transition background-color 1s ease
  z-index 100
.el-submenu.is-active:not(.is-opened)
  background #1e1e1e
.el-submenu.is-active:not(.is-opened):before
  width 3px
  background #eb603a
  content ' '
  display block
  position absolute
  left 0
  top 0
  height 100%
  z-index 100
  transition background-color 1s ease
.el-menu--popup a
  color hsla(0,0%,100%,.7)
  text-decoration none
  outline none
.el-menu-item.is-active a
  color #fff

body, html, #app, section.el-container, .aside__menu {
  height: 100%;
}

.left-aside {
  height: calc(100vh - 50px);
  overflow-y: auto;
  overflow-x: hidden;
}

.modifyPwd {
  margin-top: 10px;
}

/* width */
.left-aside::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

/* Track */
.left-aside::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.left-aside::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
.left-aside::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
<style lang="stylus" scoped>
.main-content {
  height: calc(100vh - 93px);
  position: relative;

  >>> .tab-page {
    padding: 14px;
    background: none;
    box-sizing: border-box;
  }
}
</style>
