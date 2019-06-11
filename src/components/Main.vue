<template>
  <el-container class="layout">
    <div :class="isCollapseMenu? 'aside__menu aside__menu_collapse' : 'aside__menu'">
      <div class="left-aside">
        <el-button
          class="collpase-btn"
          type="text"
          :icon="isCollapseMenu? 'el-icon-cc-indent' : 'el-icon-cc-outdent'"
          @click="toggleMenu"
        ></el-button>
        <Menu 
          @select="handleOpenMenu"
          :default-active="$route.name" 
          :items="menu" 
          :isCollapse="isCollapseMenu">
        </Menu>
      </div>
    </div>
    <el-container direction="vertical">
      <el-header class="header">
        <div class="logo" direction="vertical">
          <div class="logo__img">
            <i class="el-icon-location"></i> 内容运营平台
          </div>
        </div>
        <span role="presentation" class="el-breadcrumb__separator">/</span>
        <Breadcrumb class="breadcrumb" :items="breadcrumb"/>
        <div class="user-info">
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
        </div> -->
      </el-header>
      <TagNav ref="tag" :titles="titles" :init-tags="initTags" v-show="isShowTagNav" class="tagNav"/>
      <el-main>
        <keep-alive>
          <router-view v-if="isKeepAlive"/>
        </keep-alive>
        <router-view v-if="!isKeepAlive"/>
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
    </transition> -->
    <!-- 修改密码-->
    <el-dialog title="修改密码" :visible.sync="modifyDialogVisible">
      <span>
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="旧密码" prop="oldpwd">
            <el-input v-model="form.oldpwd" placeholder="旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpwd">
            <el-input v-model="form.newpwd" placeholder="旧密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newpwd2">
            <el-input v-model="form.newpwd2" placeholder="旧密码"></el-input>
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
  rotateStationCategory: 'rotateStationCategory',
  rotateStationCategory_viewStation: 'rotateStationCategory_viewStation',
  rotateTopicInfo: 'rotateTopicInfo',
  broadcastBlock: 'broadcastBlock' ,
  multiFunctionBlock: 'multiFunctionBlock' ,
  sysPlugin: 'sysPlugin',
  albumPannelInfo: 'albumPannelInfo',
  markPanel: 'markPanel',
  pannelInfo: 'pannelInfo',
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
  filmDetailAdBit: 'filmDetailAdBit'
}
export default {
  components: {
    Menu,
    Breadcrumb,
    TagNav
  },
  //props: ['menu'],
  data() {
    return {
      menu: [],
      titles: {},
      breadcrumb: [],
      isCollapseMenu: false,
      isShowSetting: false,
      isShowTagNav: true,
      modifyDialogVisible: false,
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
    isKeepAlive() {
      const meta = this.$route.meta
      return meta && meta.isCache !== false
    },
    initTags() {
      return this.$appState.$get('tags'+ '_' + this.$appState.user.name ) || []
    },
    defaultMenu() {
      const mainRoute = this.$router.options.routes.find(item => {
        return item.path === '/'
      })
      mainRoute.children.pop()
      function gen({ name, meta = {}, children }) {
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
    handleOpenMenu(name, menu) {
      this.$router.push({
        name: routerMap[name],
        query: menu.query,
        params: menu.params
      })
    },
    modifyPwd() {
      this.modifyDialogVisible = true
    },
    modifyPwdSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.modifyPwd(this.form, '修改成功').then(data => {
            this.modifyDialogVisible = false
            this.$logout().then(() => {
              this.$router.push({ name: 'login' })
            })
          })
        }
      })
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value != this.form.newpwd) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    },
    handleDropdownCommand(command) {
      if (command === 'logout') {
        this.$logout().then(() => {
          this.$router.push({ name: 'login' })
        })
      }
    },
    toggleMenu() {
      const isCollapseMenu = !this.isCollapseMenu
      this.$appState.$set('isCollapseMenu', isCollapseMenu)
      this.isCollapseMenu = isCollapseMenu
    },
    saveTags() {
      const tags = this.$refs.tag.tags
      if( tags.length === 0) {
        tags.unshift({
          fullPath: '/desktop',
          meta: {
            title: '我的桌面',
            tagId: 'desktop'
          },
          name: 'desktop',
          isCloseable: false
        })
      } else {
        if(tags[0].name !=='desktop') {
          tags.unshift({
          fullPath: '/desktop',
          meta: {
            title: '我的桌面',
            tagId: 'desktop'
          },
          name: 'desktop',
          isCloseable: false
        })
        }
      }
      // this.initTags = tags
      this.$appState.$set('tags'+ '_' + this.$appState.user.name , tags)
    },
    getMenu() {
      this.$service.getMenu().then((menu) => {
        const titles = {}
        const parseMenu = (menu) => {
          if (Array.isArray(menu)) {
            return menu.map(parseMenu)
          }
          titles[menu.id] = menu.text
          const item = {
            icon: menu.icon,
            route: menu.id,
            title: menu.text,
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
      })
    }
  },
  created() {
    this.isCollapseMenu = !!this.$appState.$get('isCollapseMenu')
    this.$bus.$on('breadcrumb-change', breadcrumb => {
      this.breadcrumb = breadcrumb
    })
    this.getMenu()
  },
  mounted() {
  //  this.saveTags()
    window.addEventListener('beforeunload', this.saveTags)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.saveTags)
  }
}
</script>

<style lang="stylus">
.collpase-btn
  &, &:hover, &:focus
    color: #606266
.collpase-btn
  width: 100%
  background: #fc4c02
  border-radius: 0
  padding: 14px 20px
.collpase-btn i
  font-size: 20px
  color: #fff
.collpase-btn:hover, .collpase-btn:focus
  color: #fff
  background: #e44907
.user-info
  margin-left: auto
  margin-right 15px
  cursor: pointer
.menu:not(.el-menu--collapse)
  min-width: 200px
  background: #333
.el-submenu__title
  color: #fff
.el-menu-item.is-active
  color: #fff
  background: #000
.el-menu-item
  color: #fff
.el-menu-item, .el-submenu__title
  height: 45px
  line-height: 45px
.el-submenu .el-menu-item
  height: 40px
  line-height: 40px
.el-menu
  background: #333
.el-submenu__title:hover, .el-menu-item:hover
  background: #4c4c4c
.el-submenu.is-opened .el-submenu__title
  background: #2d2d2d
.el-menu-item.is-active
  border-left: 3px solid #fc4c02
.el-submenu .el-menu
  background: #1e1e1e
body, html, #app, section.el-container, .aside__menu
  height: 100%
.left-aside
  height: 100%
  overflow-y: auto
  overflow-x: hidden
.modifyPwd
  margin-top: 10px
/* width */
.left-aside::-webkit-scrollbar
  width: 2px
  height: 2px
/* Track */
.left-aside::-webkit-scrollbar-track
  background: #f1f1f1
/* Handle */
.left-aside::-webkit-scrollbar-thumb
  background: #888
/* Handle on hover */
.left-aside::-webkit-scrollbar-thumb:hover
  background #555
</style>
<style lang="stylus" scoped>
.tagNav >>> li:first-child .tag-nav__close-item
  display none
</style>

